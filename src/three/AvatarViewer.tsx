import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Character3D } from './Character3D';
import type { AvatarAppearance } from '../types';
import type { DominantKey } from '../utils/leveling';

interface AvatarViewerProps {
  appearance: AvatarAppearance;
  level: number;
  dominantAttribute: DominantKey;
  autoRotate?: boolean;
  className?: string;
}

export function AvatarViewer({ appearance, level, dominantAttribute, autoRotate = true, className }: AvatarViewerProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.35, 5], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} castShadow />
        <directionalLight position={[-2, 1, -2]} intensity={0.3} color="#818cf8" />

        <Suspense fallback={null}>
          <Character3D appearance={appearance} level={level} dominantAttribute={dominantAttribute} />
          <ContactShadows position={[0, -1, 0]} opacity={0.45} scale={3} blur={2.2} far={1.2} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={autoRotate}
          autoRotateSpeed={1.6}
          target={[0, 0.15, 0]}
        />
      </Canvas>
    </div>
  );
}
