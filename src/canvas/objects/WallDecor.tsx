import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, neon } from '@/lib/theme';
import { NeonPath, circlePoints } from './Neon';

/** Grande insegna "</>" dentro un anello, con sfarfallio. */
function CodeSign() {
  return (
    <group position={[-2.2, 2.35, -4.93]}>
      <NeonPath points={circlePoints(0.78, 56)} color={COLORS.magenta} radius={0.03} intensity={3.4} smooth closed flicker phase={1.3} />
      <NeonPath points={circlePoints(0.9, 64)} color={COLORS.cyan} radius={0.014} intensity={2.6} smooth closed />
      {/* < */}
      <NeonPath points={[[-0.28, 0.2, 0], [-0.5, 0, 0], [-0.28, -0.2, 0]]} color={COLORS.cyan} radius={0.028} intensity={3.4} />
      {/* / */}
      <NeonPath points={[[0.07, -0.28, 0], [-0.07, 0.28, 0]]} color={COLORS.magenta} radius={0.028} intensity={3.4} />
      {/* > */}
      <NeonPath points={[[0.28, 0.2, 0], [0.5, 0, 0], [0.28, -0.2, 0]]} color={COLORS.cyan} radius={0.028} intensity={3.4} />
      <pointLight position={[0, 0, 0.9]} color={COLORS.magenta} intensity={9} distance={7} />
    </group>
  );
}

const BARS = 12;

/** Pannello "system monitor": barre che oscillano, anello di carico, linee di log. */
function DataPanel() {
  const bars = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    bars.current?.children.forEach((b, i) => {
      const h = 0.15 + (Math.sin(t * 1.6 + i * 0.9) * 0.5 + 0.5) * 0.55 * (0.6 + 0.4 * Math.sin(t * 0.7 + i));
      b.scale.y = h;
      b.position.y = -0.4 + h / 2;
    });
    if (ring.current) ring.current.rotation.z = -t * 0.8;
  });

  return (
    <group position={[0.7, 2.1, -4.93]}>
      <mesh>
        <boxGeometry args={[1.9, 1.15, 0.05]} />
        <meshStandardMaterial color="#080a12" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.8, 1.05]} />
        <meshBasicMaterial color={neon('#0a1a24', 1.5, 0)} toneMapped={false} />
      </mesh>
      <group ref={bars} position={[-0.45, 0, 0.04]}>
        {Array.from({ length: BARS }, (_, i) => (
          <mesh key={i} position={[(i - BARS / 2) * 0.07 + 0.35, -0.3, 0]}>
            <boxGeometry args={[0.045, 1, 0.01]} />
            <meshBasicMaterial color={neon(i % 3 === 0 ? COLORS.magenta : COLORS.cyan, 2.8)} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh ref={ring} position={[0.55, 0.2, 0.045]}>
        <torusGeometry args={[0.2, 0.012, 8, 40, Math.PI * 1.5]} />
        <meshBasicMaterial color={neon(COLORS.amber, 3)} toneMapped={false} />
      </mesh>
      {[0.46, 0.38, 0.3].map((y, i) => (
        <mesh key={y} position={[-0.6 + i * 0.03, y, 0.04]}>
          <planeGeometry args={[0.5 - i * 0.07, 0.025]} />
          <meshBasicMaterial color={neon(COLORS.cyan, 1.8)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Mensole con oggetti emissivi: provette, cubi dati, libri. */
function Shelves() {
  const jars = useMemo(
    () => [
      { x: -0.5, c: COLORS.lime },
      { x: -0.18, c: COLORS.magenta },
      { x: 0.2, c: COLORS.cyan },
      { x: 0.5, c: COLORS.amber },
    ],
    [],
  );
  return (
    <group position={[-3.75, 2.55, -4.84]}>
      <mesh>
        <boxGeometry args={[1.8, 0.05, 0.3]} />
        <meshStandardMaterial color="#1a1c2a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.72, 0]}>
        <boxGeometry args={[1.8, 0.05, 0.3]} />
        <meshStandardMaterial color="#1a1c2a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Provette luminose */}
      {jars.map(({ x, c }) => (
        <group key={x} position={[x, 0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.34, 16]} />
            <meshBasicMaterial color={neon(c, 2.2, 0.15)} toneMapped={false} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.03, 16]} />
            <meshStandardMaterial color="#222536" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Libri */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-0.7 + i * 0.09, -0.52, 0.02]} rotation={[0, 0, i === 4 ? -0.25 : 0]}>
          <boxGeometry args={[0.07, 0.3 - (i % 2) * 0.04, 0.2]} />
          <meshStandardMaterial color={['#2a1f4d', '#13324a', '#3d1a3a', '#1c2b2b', '#44244a'][i]} roughness={0.7} />
        </mesh>
      ))}
      {/* Cubo dati fluttuante-lampeggiante */}
      <mesh position={[0.5, -0.57, 0.02]} rotation={[0.3, 0.6, 0]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshBasicMaterial color={neon(COLORS.violet, 2.8)} wireframe toneMapped={false} />
      </mesh>
    </group>
  );
}

export function WallDecor() {
  return (
    <>
      <CodeSign />
      <DataPanel />
      <Shelves />
    </>
  );
}
