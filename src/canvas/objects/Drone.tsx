import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, neon } from '@/lib/theme';

/** Piccolo drone di sorveglianza che pattuglia la stanza lungo una traiettoria lissajous. */
export function Drone() {
  const group = useRef<THREE.Group>(null);
  const eye = useRef<THREE.Mesh>(null);
  const prev = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime * 0.28;
    const x = Math.sin(t * 1.0) * 3.2 + 0.4;
    const z = Math.sin(t * 0.7 + 1) * 2.8 - 0.6;
    const y = 2.9 + Math.sin(t * 2.3) * 0.18;
    g.position.set(x, y, z);
    // guarda nella direzione di marcia
    const dir = g.position.clone().sub(prev.current);
    if (dir.lengthSq() > 1e-8) g.rotation.y = Math.atan2(dir.x, dir.z);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -dir.x * 4, 4, 0.016);
    prev.current.copy(g.position);
    if (eye.current) (eye.current.material as THREE.MeshBasicMaterial).color.copy(neon(COLORS.magenta, 2.4 + Math.sin(clock.elapsedTime * 6) * 1.2));
  });

  return (
    <group ref={group}>
      <mesh castShadow>
        <sphereGeometry args={[0.13, 20, 16]} />
        <meshStandardMaterial color="#1b1e2e" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.1]} ref={eye}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={neon(COLORS.magenta, 3)} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.012, 8, 28]} />
        <meshBasicMaterial color={neon(COLORS.cyan, 3)} toneMapped={false} />
      </mesh>
      <pointLight color={COLORS.magenta} intensity={3} distance={4} />
    </group>
  );
}
