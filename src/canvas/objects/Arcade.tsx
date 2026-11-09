import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, neon } from '@/lib/theme';
import { NeonPath } from './Neon';

/** Cabinato arcade generico: schermo con sprite animati, marquee e pulsanti luminosi. */
export function Arcade() {
  const sprites = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    sprites.current?.children.forEach((s, i) => {
      s.position.x = Math.sin(t * (0.8 + i * 0.25) + i * 2) * 0.22;
      s.position.y = 0.2 - i * 0.11 + Math.sin(t * 2 + i) * 0.01;
    });
    screenMat.current?.color.setHSL((t * 0.05) % 1, 0.9, 0.12).multiplyScalar(2);
  });

  return (
    <group position={[-4.1, 0, -3.9]} rotation={[0, Math.PI / 4, 0]}>
      {/* Corpo */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.82, 1.9, 0.7]} />
        <meshStandardMaterial color="#12141f" roughness={0.45} metalness={0.5} />
      </mesh>
      {/* Marquee */}
      <mesh position={[0, 1.75, 0.355]}>
        <boxGeometry args={[0.74, 0.22, 0.02]} />
        <meshBasicMaterial color={neon(COLORS.magenta, 2.6)} toneMapped={false} />
      </mesh>
      {/* Schermo inclinato */}
      <group position={[0, 1.3, 0.36]} rotation={[-0.12, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.66, 0.52]} />
          <meshBasicMaterial ref={screenMat} color="#102040" toneMapped={false} />
        </mesh>
        <group ref={sprites} position={[0, 0, 0.005]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i}>
              <boxGeometry args={[0.07, 0.05, 0.005]} />
              <meshBasicMaterial color={neon(i === 1 ? COLORS.lime : COLORS.cyan, 3)} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
      {/* Pannello comandi */}
      <mesh position={[0, 0.92, 0.4]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.3]} />
        <meshStandardMaterial color="#181a28" roughness={0.4} metalness={0.5} />
      </mesh>
      {[-0.2, -0.05, 0.1, 0.25].map((x, i) => (
        <mesh key={x} position={[x, 0.98, 0.42 - (i % 2) * 0.04]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color={neon([COLORS.magenta, COLORS.cyan, COLORS.amber, COLORS.lime][i], 3)} toneMapped={false} />
        </mesh>
      ))}
      {/* Bordi neon laterali */}
      <NeonPath points={[[-0.415, 0.1, 0.36], [-0.415, 1.85, 0.36]]} color={COLORS.cyan} radius={0.012} intensity={3} />
      <NeonPath points={[[0.415, 0.1, 0.36], [0.415, 1.85, 0.36]]} color={COLORS.cyan} radius={0.012} intensity={3} />
      <pointLight position={[0, 1.3, 0.9]} color={COLORS.magenta} intensity={5} distance={4} />
    </group>
  );
}
