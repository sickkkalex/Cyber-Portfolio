import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Interactive } from '../Interactive';
import { COLORS, neon } from '@/lib/theme';

export function Hologram() {
  const knot = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (knot.current) {
      knot.current.rotation.y += delta * 0.6;
      knot.current.rotation.x += delta * 0.25;
    }
    if (ringA.current) ringA.current.rotation.x += delta * 0.9;
    if (ringB.current) ringB.current.rotation.y += delta * 1.2;
    if (orbit.current) orbit.current.rotation.y += delta * 0.8;
    // piano di scansione che sale e scende lungo il cono
    if (scan.current) {
      const k = (Math.sin(t * 1.1) * 0.5 + 0.5);
      scan.current.position.y = 0.3 + k * 1.8;
      scan.current.scale.setScalar((0.3 + 0.25 * k) / 0.355);
    }
  });

  return (
    <Interactive id="hologram" position={[1.8, 0, 1.2]} hoverScale={1.08} beaconY={2.6}>
      {({ hovered, active }) => {
        const on = hovered || active;
        const color = on ? COLORS.violet : COLORS.cyan;
        const accent = on ? COLORS.magenta : COLORS.violet;
        return (
          <>
            {/* Piedistallo */}
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.45, 0.55, 0.3, 32]} />
              <meshStandardMaterial color="#14161f" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.38, 48]} />
              <meshBasicMaterial color={neon(color, 3)} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.55, 0.58, 48]} />
              <meshBasicMaterial color={neon(accent, 3)} toneMapped={false} />
            </mesh>

            {/* Cono di proiezione (additivo) */}
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.55, 0.3, 1.8, 40, 1, true]} />
              <meshBasicMaterial color={neon(color, 0.55, 0)} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
            <mesh ref={scan} position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.34, 0.37, 48]} />
              <meshBasicMaterial color={neon(color, 3)} toneMapped={false} transparent opacity={0.9} />
            </mesh>

            {/* Ologramma fluttuante */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.05, 0.1]}>
              <mesh ref={knot} position={[0, 1.5, 0]}>
                <torusKnotGeometry args={[0.32, 0.09, 140, 16]} />
                <meshBasicMaterial color={neon(color, 2.6, 0.1)} wireframe toneMapped={false} transparent opacity={0.9} />
              </mesh>
              {/* Anelli giroscopici */}
              <mesh ref={ringA} position={[0, 1.5, 0]}>
                <torusGeometry args={[0.55, 0.008, 8, 64]} />
                <meshBasicMaterial color={neon(accent, 3)} toneMapped={false} />
              </mesh>
              <mesh ref={ringB} position={[0, 1.5, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
                <torusGeometry args={[0.7, 0.006, 8, 64]} />
                <meshBasicMaterial color={neon(color, 2.6)} toneMapped={false} />
              </mesh>
              {/* Cubetti dati in orbita */}
              <group ref={orbit} position={[0, 1.5, 0]}>
                {[0, 1, 2, 3].map((i) => (
                  <mesh key={i} position={[Math.cos((i / 4) * Math.PI * 2) * 0.85, Math.sin(i * 1.7) * 0.25, Math.sin((i / 4) * Math.PI * 2) * 0.85]}>
                    <boxGeometry args={[0.07, 0.07, 0.07]} />
                    <meshBasicMaterial color={neon(i % 2 ? COLORS.magenta : COLORS.cyan, 3)} toneMapped={false} />
                  </mesh>
                ))}
              </group>
            </Float>

            <Sparkles count={40} scale={[1, 2, 1]} position={[0, 1.2, 0]} size={3} speed={0.6} opacity={0.9} color={color} />

            <pointLight position={[0, 1.5, 0]} color={color} intensity={on ? 14 : 7} distance={5} />
          </>
        );
      }}
    </Interactive>
  );
}
