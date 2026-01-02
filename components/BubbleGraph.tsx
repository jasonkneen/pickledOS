
import React, { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useCursor, useTexture, AdaptiveDpr, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Memory } from '../types';

interface BubbleGraphProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  selectedId: string | null;
}

interface BubbleNodeProps {
  memory: Memory;
  isSelected: boolean;
  onSelect: (m: Memory) => void;
  position: [number, number, number];
}

// Reusable geometry to reduce GPU memory overhead
const bubbleGeometry = new THREE.SphereGeometry(1, 32, 32);
const innerGeometry = new THREE.SphereGeometry(0.98, 32, 32);

// GPU Particle System for Data Ambience
const DataParticles = () => {
  const count = 2000;
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 
      const r = 50 + Math.random() * 100;
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
     if (mesh.current) {
         mesh.current.rotation.y += delta * 0.05;
         mesh.current.rotation.x += delta * 0.02;
     }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.4} 
        color="#93c5fd" 
        transparent 
        opacity={0.6} 
        sizeAttenuation={true} 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};


const BubbleContent = ({ url }: { url: string }) => {
  const texture = useTexture(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  
  return (
    <mesh geometry={innerGeometry}>
      <meshStandardMaterial 
        map={texture} 
        roughness={0.2}
        metalness={0.1}
        envMapIntensity={1.5}
      />
    </mesh>
  );
};

// Optimized Connections using single Draw Call (lineSegments)
const Connections = ({ memories, positions }: { memories: Memory[], positions: [number, number, number][] }) => {
    const geometry = useMemo(() => {
        if (!memories.length || !positions.length) return new THREE.BufferGeometry();

        const points: number[] = [];
        const posMap = new Map<string, [number, number, number]>();
        
        // Fast lookup
        memories.forEach((mem, i) => posMap.set(mem.id, positions[i]));

        memories.forEach((mem, i) => {
            if (mem.relatedIds && mem.relatedIds.length > 0) {
                const startPos = positions[i];
                // Safety check
                if (!startPos) return;

                mem.relatedIds.forEach(targetId => {
                    const endPos = posMap.get(targetId);
                    if (endPos) {
                        points.push(...startPos, ...endPos);
                    }
                });
            }
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        return geo;
    }, [memories, positions]);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color="#94a3b8" transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
        </lineSegments>
    );
};

const BubbleNode: React.FC<BubbleNodeProps> = ({ 
  memory, 
  isSelected, 
  onSelect, 
  position 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth lerp for scale interactions
      const targetScale = isSelected ? 1.6 : (hovered ? 1.3 : 1.0);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
      
      // Idle animation
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.5} 
      position={position}
    >
      <group 
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(memory);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
         {/* Premium Glass Shell using MeshTransmissionMaterial */}
         <mesh geometry={bubbleGeometry}>
            <MeshTransmissionMaterial 
                backside={false}
                samples={4} // GPU Friendly
                resolution={512} 
                transmission={1}
                roughness={0.05}
                thickness={1.5}
                ior={1.5}
                chromaticAberration={0.1} // Increased for sci-fi look
                anisotropy={0.2}
                distortion={0.2}
                distortionScale={0.4}
                temporalDistortion={0.2}
                clearcoat={1}
                attenuationDistance={0.5}
                attenuationColor="#ffffff"
                color={isSelected ? "#bfdbfe" : "#ffffff"}
                toneMapped={true}
            />
         </mesh>

         {/* Inner Content - Textured Sphere */}
         <Suspense fallback={
            <mesh geometry={innerGeometry}>
              <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
            </mesh>
         }>
            {memory.previewImage && <BubbleContent url={memory.previewImage} />}
         </Suspense>
         
         {/* Selection Halo - Emissive for Bloom */}
         {isSelected && (
            <mesh scale={1.1}>
                 <sphereGeometry args={[1, 32, 32]} />
                 <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} side={THREE.BackSide} />
            </mesh>
         )}
         {isSelected && (
            <pointLight distance={6} intensity={4} color="#3b82f6" decay={2} />
         )}
      </group>
    </Float>
  );
};

const BubblesScene = ({ memories, onSelectMemory, selectedId }: BubbleGraphProps) => {
  // Pre-calculate positions (Fibonacci Sphere algorithm for even distribution)
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); 

    for (let i = 0; i < memories.length; i++) {
        const y = 1 - (i / (Math.max(memories.length, 1) - 1)) * 2; 
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const spread = 22; 
        const randomOffset = 0.8 + (Math.sin(i * 123) * 0.5 + 0.5) * 0.4;
        
        pos.push([
            x * spread * randomOffset, 
            y * spread * randomOffset, 
            z * spread * randomOffset
        ]);
    }
    return pos;
  }, [memories.length]); 

  return (
    <>
      <color attach="background" args={['#e8e9eb']} />
      
      {/* Lights */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 20, 10]} intensity={2.5} castShadow />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#bfdbfe" />
      <spotLight position={[0, 50, 0]} intensity={1.5} angle={0.5} penumbra={1} />
      
      {/* Data Environment */}
      <DataParticles />
      <Environment preset="city" />
      
      <group>
        <Connections memories={memories} positions={positions} />
        {memories.map((mem, i) => (
          <BubbleNode 
            key={mem.id}
            memory={mem}
            isSelected={selectedId === mem.id}
            onSelect={onSelectMemory}
            position={positions[i]}
          />
        ))}
      </group>

      {/* Post Processing Pipeline */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={1.1} // Only very bright things glow
            mipmapBlur 
            intensity={0.6} 
            radius={0.6} 
        />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
        <Noise opacity={0.02} />
      </EffectComposer>

      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={120}
        rotateSpeed={0.6}
        autoRotate={!selectedId}
        autoRotateSpeed={0.5}
      />
      
      <AdaptiveDpr pixelated />
    </>
  );
};

const BubbleGraph: React.FC<BubbleGraphProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 50], fov: 35, near: 0.1, far: 1000 }} 
        dpr={[1, 1.5]} 
        gl={{ 
            powerPreference: "high-performance",
            antialias: false, // Disabled because EffectComposer handles AA or we accept aliasing for perf
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            alpha: true,
            stencil: false,
            depth: true
        }}
      >
        <Suspense fallback={null}>
           <BubblesScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BubbleGraph;
