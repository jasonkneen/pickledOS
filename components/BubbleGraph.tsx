import React, { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useCursor, useTexture, Line, AdaptiveDpr } from '@react-three/drei';
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

const BubbleContent = ({ url }: { url: string }) => {
  const texture = useTexture(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  
  return (
    <mesh>
      <sphereGeometry args={[0.98, 64, 64]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.1}
        metalness={0.0}
        envMapIntensity={1}
      />
    </mesh>
  );
};

const Connections = ({ memories, positions }: { memories: Memory[], positions: [number, number, number][] }) => {
    const posMap = useMemo(() => {
        const map = new Map<string, [number, number, number]>();
        memories.forEach((mem, i) => map.set(mem.id, positions[i]));
        return map;
    }, [memories, positions]);

    const lines = useMemo(() => {
        const lineSegments: React.ReactElement[] = [];
        memories.forEach((mem) => {
            if (mem.relatedIds && mem.relatedIds.length > 0) {
                const startPos = posMap.get(mem.id);
                if (!startPos) return;

                mem.relatedIds.forEach(targetId => {
                    const endPos = posMap.get(targetId);
                    if (endPos) {
                        lineSegments.push(
                            <Line
                                key={`${mem.id}-${targetId}`}
                                points={[startPos, endPos]}
                                color="#94a3b8" 
                                lineWidth={1}
                                transparent
                                opacity={0.1}
                            />
                        );
                    }
                });
            }
        });
        return lineSegments;
    }, [memories, posMap]);

    return <group>{lines}</group>;
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
      const targetScale = isSelected ? 1.8 : (hovered ? 1.4 : 1.0);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Float 
      speed={1.5} 
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
         {/* Outer Glass Shell - Ray-traced aesthetic */}
         <mesh>
            <sphereGeometry args={[1.05, 64, 64]} />
            <meshPhysicalMaterial 
              transmission={1.0} 
              thickness={1.2} 
              roughness={0.05}
              ior={1.5} 
              clearcoat={1}
              clearcoatRoughness={0}
              transparent
              color={isSelected ? "#ffffff" : "#ffffff"}
              attenuationColor="#e2e8f0"
              attenuationDistance={0.5}
              envMapIntensity={2}
            />
         </mesh>

         {/* Inner Content */}
         <Suspense fallback={
            <mesh>
              <sphereGeometry args={[0.98, 32, 32]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.5} />
            </mesh>
         }>
            {memory.previewImage && <BubbleContent url={memory.previewImage} />}
         </Suspense>
         
         {/* Subtle Glow for Selected */}
         {isSelected && (
            <pointLight distance={3} intensity={0.5} color="#blue" />
         )}
      </group>
    </Float>
  );
};

const BubblesScene = ({ memories, onSelectMemory, selectedId }: BubbleGraphProps) => {
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); 

    for (let i = 0; i < memories.length; i++) {
        const y = 1 - (i / (memories.length - 1)) * 2; 
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const spread = 20; 
        const randomOffset = 0.85 + Math.random() * 0.3;
        pos.push([
            x * spread * randomOffset, 
            y * spread * randomOffset, 
            z * spread * randomOffset
        ]);
    }
    return pos;
  }, [memories]);

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#b0c4de" />
      
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
        maxDistance={100}
        rotateSpeed={0.5}
      />
      
      <AdaptiveDpr pixelated />
    </>
  );
};

const BubbleGraph: React.FC<BubbleGraphProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 45], fov: 40 }} 
        dpr={[1, 2]} 
        // Force high performance mode for GPU
        gl={{ 
            powerPreference: "high-performance",
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            alpha: true
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