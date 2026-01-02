
import React, { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useCursor, useTexture, AdaptiveDpr, MeshTransmissionMaterial } from '@react-three/drei';
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
                    // Avoid duplicating lines if possible, or just allow overlap for simplicity
                    // Only draw if target exists
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
            <lineBasicMaterial color="#94a3b8" transparent opacity={0.15} depthWrite={false} />
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
      // Subtle rotation
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
                samples={4} // Lower samples for performance, sufficient for bubbles
                resolution={512} // Texture resolution for transmission
                transmission={1}
                roughness={0.0}
                thickness={1.5}
                ior={1.5}
                chromaticAberration={0.06}
                anisotropy={0.1}
                distortion={0.1}
                distortionScale={0.3}
                temporalDistortion={0.5}
                clearcoat={1}
                attenuationDistance={0.5}
                attenuationColor="#ffffff"
                color={isSelected ? "#e0f2fe" : "#ffffff"}
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
         
         {/* Selection Halo */}
         {isSelected && (
            <pointLight distance={4} intensity={2} color="#3b82f6" decay={2} />
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

        const spread = 22; // Slightly wider spread
        // Deterministic offset based on index to keep layout stable but organic
        const randomOffset = 0.8 + (Math.sin(i * 123) * 0.5 + 0.5) * 0.4;
        
        pos.push([
            x * spread * randomOffset, 
            y * spread * randomOffset, 
            z * spread * randomOffset
        ]);
    }
    return pos;
  }, [memories.length]); // Only recalc if count changes

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 20, 10]} intensity={2.5} castShadow />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#bfdbfe" />
      <spotLight position={[0, 50, 0]} intensity={1.5} angle={0.5} penumbra={1} />
      
      {/* City preset gives good reflections for glass */}
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

      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={120}
        rotateSpeed={0.6}
        autoRotate={!selectedId} // Auto rotate when idle adds to the "Live" feel
        autoRotateSpeed={0.5}
      />
      
      {/* Downscale pixel density on move for performance */}
      <AdaptiveDpr pixelated />
    </>
  );
};

const BubbleGraph: React.FC<BubbleGraphProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 50], fov: 35, near: 0.1, far: 1000 }} 
        dpr={[1, 1.5]} // Cap DPR at 1.5 for performance on high-res screens
        gl={{ 
            powerPreference: "high-performance",
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            alpha: true,
            stencil: false,
            depth: true
        }}
        performance={{ min: 0.5 }} // Allow downgrading quality on slow devices
      >
        <Suspense fallback={null}>
           <BubblesScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BubbleGraph;
