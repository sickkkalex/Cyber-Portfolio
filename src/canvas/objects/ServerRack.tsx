import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Interactive } from '../Interactive';
import { COLORS, neon } from '@/lib/theme';
import { LedStrip } from './Neon';

const WHITE = new THREE.Color('#ffffff');

/** LED che pulsa con fase sfalsata; in hover/active pulsa più forte. */
function Led({ position, color, phase, boost }: { position: [number, number, number]; color: string; phase: number; boost: boolean }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const base = useRef(new THREE.Color(color));
  useFrame(({ clock }) => {
    if (!mat.current) return;
    const k = (boost ? 3.2 : 2.2) + Math.sin(clock.elapsedTime * 3 + phase) * 1.4;
    mat.current.color.copy(base.current).lerp(WHITE, 0.25).multiplyScalar(Math.max(0.3, k));
  });
  return (
    <mesh position={position}>
      <boxGeometry args={[0.05, 0.05, 0.02]} />
      <meshBasicMaterial ref={mat} color={color} toneMapped={false} />
    </mesh>
  );
}

/** Ventola che gira in cima al rack. */
function Fan({ position }: { position: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g.current) g.current.rotation.z += d * 9;
  });
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.16, 0.012, 8, 32]} />
        <meshBasicMaterial color={neon(COLORS.cyan, 2.8)} toneMapped={false} />
      </mesh>
      <group ref={g}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i / 4) * Math.PI * 2]} position={[0, 0, 0]}>
            <boxGeometry args={[0.03, 0.28, 0.004]} />
            <meshStandardMaterial color="#222536" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const UNITS = 6;

export function ServerRack() {
  return (
    <Interactive id="rack" position={[2.2, 0, -3.2]} rotation={[0, Math.PI / 4, 0]} beaconY={2.9}>
      {({ hovered, active }) => {
        const boost = hovered || active;
        return (
          <>
            {/* Telaio */}
            <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[1, 2.3, 0.9]} />
              <meshStandardMaterial color="#12141d" roughness={0.45} metalness={0.5} />
            </mesh>

            {/* Montanti luminosi frontali */}
            <LedStrip position={[-0.5, 1.15, 0.455]} size={[0.02, 2.3, 0.02]} color={boost ? COLORS.violet : COLORS.cyan} intensity={3} />
            <LedStrip position={[0.5, 1.15, 0.455]} size={[0.02, 2.3, 0.02]} color={boost ? COLORS.violet : COLORS.cyan} intensity={3} />
            <LedStrip position={[0, 2.3, 0.455]} size={[1, 0.02, 0.02]} color={COLORS.magenta} intensity={3} />

            {/* Unità rack con LED e prese d'aria */}
            {Array.from({ length: UNITS }, (_, i) => {
              const y = 0.4 + i * 0.34;
              const color = i % 2 === 0 ? COLORS.cyan : COLORS.violet;
              return (
                <group key={i}>
                  <mesh position={[0, y, 0.455]} castShadow>
                    <boxGeometry args={[0.88, 0.26, 0.02]} />
                    <meshStandardMaterial color={boost ? '#1f2234' : '#181a26'} roughness={0.4} metalness={0.6} />
                  </mesh>
                  {[-0.3, -0.22, -0.14, -0.06].map((x) => (
                    <mesh key={x} position={[x, y, 0.468]}>
                      <boxGeometry args={[0.03, 0.14, 0.004]} />
                      <meshBasicMaterial color="#05060a" />
                    </mesh>
                  ))}
                  <Led position={[0.36, y, 0.472]} color={color} phase={i * 1.3} boost={boost} />
                  <Led position={[0.28, y, 0.472]} color={i % 3 === 0 ? COLORS.lime : COLORS.cyan} phase={i * 0.7 + 2} boost={boost} />
                  <Led position={[0.2, y, 0.472]} color={COLORS.amber} phase={i * 2.1} boost={boost} />
                </group>
              );
            })}

            <Fan position={[0, 2.31, 0]} />

            <pointLight position={[0, 1.2, 1]} color={boost ? COLORS.violet : COLORS.cyan} intensity={boost ? 9 : 4} distance={4.5} />
          </>
        );
      }}
    </Interactive>
  );
}
