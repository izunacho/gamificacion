import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { AttributeKey, AvatarAppearance } from '../types';
import type { DominantKey } from '../utils/leveling';

interface Character3DProps {
  appearance: AvatarAppearance;
  level: number;
  dominantAttribute: DominantKey;
}

const ATTRIBUTE_AURA_COLOR: Record<AttributeKey, string> = {
  fuerza: '#fb923c',
  enfoque: '#38bdf8',
  salud: '#34d399',
  disciplina: '#a78bfa',
};

export function Character3D({ appearance, level, dominantAttribute }: Character3DProps) {
  const groupRef = useRef<Group>(null);
  const auraRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.4) * 0.035;
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = t * 0.6;
    }
  });

  const auraColor =
    dominantAttribute === 'balanced' || dominantAttribute === 'novice'
      ? '#818cf8'
      : ATTRIBUTE_AURA_COLOR[dominantAttribute];

  const auraTier = level >= 20 ? 2 : level >= 5 ? 1 : 0;

  return (
    <group>
      <group ref={groupRef}>
        {/* legs */}
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, -0.45, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.1, 0.9, 12]} />
            <meshStandardMaterial color={appearance.outfitColor} roughness={0.6} />
          </mesh>
        ))}

        {/* shoes */}
        {[-0.15, 0.15].map((x) => (
          <mesh key={`shoe-${x}`} position={[x, -0.95, 0.04]} castShadow>
            <boxGeometry args={[0.17, 0.12, 0.28]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
        ))}

        {/* torso */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.55, 0.75, 0.3]} />
          <meshStandardMaterial color={appearance.outfitColor} roughness={0.55} />
        </mesh>

        {/* arms */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[0.42 * side, 0.42, 0]}
            rotation={[0, 0, side * -0.12]}
            castShadow
          >
            <cylinderGeometry args={[0.09, 0.08, 0.65, 10]} />
            <meshStandardMaterial color={appearance.skinColor} roughness={0.6} />
          </mesh>
        ))}

        {/* head */}
        <mesh position={[0, 1.12, 0]} castShadow>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial color={appearance.skinColor} roughness={0.5} />
        </mesh>

        {/* hair */}
        <mesh position={[0, 1.28, -0.03]} scale={[1.05, 0.55, 1.05]} castShadow>
          <sphereGeometry args={[0.29, 16, 16]} />
          <meshStandardMaterial color={appearance.hairColor} roughness={0.7} />
        </mesh>

        {/* eyes */}
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 1.13, 0.25]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#0f0f10" />
          </mesh>
        ))}

        <ClassAccessory dominantAttribute={dominantAttribute} />
      </group>

      {auraTier > 0 && (
        <group ref={auraRef} position={[0, -0.98, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.025, 8, 48]} />
            <meshStandardMaterial
              color={auraColor}
              emissive={auraColor}
              emissiveIntensity={auraTier === 2 ? 1.4 : 0.8}
              transparent
              opacity={0.75}
            />
          </mesh>
          {auraTier === 2 && (
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.35}>
              <torusGeometry args={[0.55, 0.014, 8, 48]} />
              <meshStandardMaterial
                color={auraColor}
                emissive={auraColor}
                emissiveIntensity={1}
                transparent
                opacity={0.4}
              />
            </mesh>
          )}
          <pointLight color={auraColor} intensity={auraTier === 2 ? 4 : 2} distance={2.5} position={[0, 0.6, 0]} />
        </group>
      )}
    </group>
  );
}

function ClassAccessory({ dominantAttribute }: { dominantAttribute: Character3DProps['dominantAttribute'] }) {
  switch (dominantAttribute) {
    case 'fuerza':
      return (
        <group position={[0.55, 0.15, 0.05]} rotation={[0, 0, -0.35]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.06, 0.7, 0.02]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.04]} />
            <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.22, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        </group>
      );
    case 'enfoque':
      return (
        <group position={[0, 0.28, 0.32]} rotation={[-0.3, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.36, 0.28, 0.05]} />
            <meshStandardMaterial color="#312e81" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.32, 0.24, 0.02]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} />
          </mesh>
        </group>
      );
    case 'salud':
      return (
        <group position={[0.5, -0.1, 0.05]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1.15, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.08, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1.1} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'disciplina':
      return (
        <mesh position={[0, 0.35, -0.22]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.04]} />
          <meshStandardMaterial color="#4c1d95" roughness={0.75} />
        </mesh>
      );
    default:
      return null;
  }
}
