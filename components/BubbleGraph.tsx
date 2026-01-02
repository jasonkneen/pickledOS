
import React, { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useCursor, useTexture, AdaptiveDpr, Billboard } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Memory } from '../types';
import { VisualSettings } from './SettingsPanel';

interface BubbleGraphProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  selectedId: string | null;
  settings: VisualSettings;
}

interface BubbleNodeProps {
  memory: Memory;
  isSelected: boolean;
  onSelect: (m: Memory) => void;
  position: [number, number, number];
  settings: VisualSettings;
}

const bubbleGeometry = new THREE.SphereGeometry(1, 48, 48); 
const imageGeometry = new THREE.CircleGeometry(0.85, 32); 

// GPU Particle System
const DataParticles = ({ opacity }: { opacity: number }) => {
  const count = 1500; 
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 
      const r = 40 + Math.random() * 80;
      
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
         mesh.current.rotation.y += delta * 0.04;
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
        size={0.6}
        color="#94a3b8" 
        transparent 
        opacity={opacity} 
        sizeAttenuation={true} 
        depthWrite={false}
      />
    </points>
  );
};


const BubbleContent = ({ url }: { url: string }) => {
  const texture = useTexture(url);
  texture.center.set(0.5, 0.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  
  return (
    <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
      <mesh geometry={imageGeometry}>
        <meshBasicMaterial 
          map={texture} 
          transparent
          opacity={1} 
          side={THREE.DoubleSide}
          toneMapped={false} 
        />
      </mesh>
    </Billboard>
  );
};

const Connections = ({ memories, positions, opacity }: { memories: Memory[], positions: [number, number, number][], opacity: number }) => {
    const geometry = useMemo(() => {
        if (!memories.length || !positions.length) return new THREE.BufferGeometry();

        const points: number[] = [];
        const posMap = new Map<string, [number, number, number]>();
        
        memories.forEach((mem, i) => posMap.set(mem.id, positions[i]));

        memories.forEach((mem, i) => {
            if (mem.relatedIds && mem.relatedIds.length > 0) {
                const startPos = positions[i];
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
            <lineBasicMaterial color="#64748b" transparent opacity={opacity} depthWrite={false} />
        </lineSegments>
    );
};

const BubbleNode: React.FC<BubbleNodeProps> = ({ 
  memory, 
  isSelected, 
  onSelect, 
  position,
  settings
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = isSelected ? 1.5 : (hovered ? 1.2 : 1.0);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
      groupRef.current.rotation.y += delta * 0.2;
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
         {/* Glass Shell */}
         <mesh geometry={bubbleGeometry}>
            <meshPhysicalMaterial 
                color={isSelected ? "#bfdbfe" : "#cbd5e1"} 
                transmission={settings.glassTransmission} 
                opacity={settings.glassOpacity} 
                metalness={0.2}
                roughness={settings.glassRoughness}
                ior={1.5}
                thickness={settings.glassThickness}
                specularIntensity={1}
                envMapIntensity={1} 
                clearcoat={1}
                clearcoatRoughness={0.1}
                transparent={true} 
                side={THREE.FrontSide}
            />
         </mesh>

         {/* Inner Content */}
         <Suspense fallback={
            <mesh scale={0.5}>
              <sphereGeometry args={[0.5, 12, 12]} />
              <meshBasicMaterial color="#94a3b8" transparent opacity={0.5} />
            </mesh>
         }>
            {memory.previewImage && <BubbleContent url={memory.previewImage} />}
         </Suspense>
         
         {/* Selection / Hover Highlight */}
         {(isSelected || hovered) && (
            <mesh scale={1.05}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshBasicMaterial 
                    color="#3b82f6" 
                    transparent 
                    opacity={isSelected ? 0.2 : 0.1} 
                    depthWrite={false} 
                    toneMapped={false}
                    side={THREE.BackSide} 
                />
            </mesh>
         )}
         
         {isSelected && (
            <pointLight distance={8} intensity={5} color="#3b82f6" decay={2} />
         )}
      </group>
    </Float>
  );
};

const BubblesScene = ({ memories, onSelectMemory, selectedId, settings }: BubbleGraphProps) => {
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
      <color attach="background" args={['#f1f5f9']} />
      
      <ambientLight intensity={settings.ambientLightIntensity} />
      <directionalLight position={[10, 20, 10]} intensity={settings.directionalLightIntensity} castShadow />
      <directionalLight position={[-10, 0, -10]} intensity={settings.directionalLightIntensity * 0.5} color="#94a3b8" />
      <directionalLight position={[0, -10, 5]} intensity={0.5} color="#cbd5e1" />
      
      <DataParticles opacity={settings.particleOpacity} />
      <Environment preset="city" background={false} />
      
      <group>
        <Connections memories={memories} positions={positions} opacity={settings.connectionOpacity} />
        {memories.map((mem, i) => (
          <BubbleNode 
            key={mem.id}
            memory={mem}
            isSelected={selectedId === mem.id}
            onSelect={onSelectMemory}
            position={positions[i]}
            settings={settings}
          />
        ))}
      </group>

      <EffectComposer disableNormalPass multisampling={0}>
        <BrightnessContrast 
          brightness={settings.brightness} 
          contrast={settings.contrast} 
        />
        <HueSaturation 
          saturation={settings.saturation} 
          hue={0} 
        />
        <Bloom 
            luminanceThreshold={settings.bloomThreshold}
            mipmapBlur 
            intensity={settings.bloomIntensity}
            radius={settings.bloomRadius}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
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
            antialias: true,
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
