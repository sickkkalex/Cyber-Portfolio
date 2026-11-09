import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, neon } from '@/lib/theme';

interface Run {
  pts: [number, number, number][];
  color: string;
  speed: number;
}

/** Cavi dati sul pavimento dal rack alla workstation e all'ologramma, con impulsi luminosi che viaggiano. */
export function Cables() {
  const runs: Run[] = useMemo(
    () => [
      { pts: [[1.7, 0.03, -2.6], [1.0, 0.03, -1.8], [-0.2, 0.03, -1.4], [-1.0, 0.03, -1.0]], color: COLORS.cyan, speed: 0.22 },
      { pts: [[2.0, 0.03, -2.6], [2.3, 0.03, -1.2], [2.0, 0.03, 0.2], [1.8, 0.03, 0.5]], color: COLORS.magenta, speed: 0.18 },
      { pts: [[1.5, 0.03, -2.7], [0.3, 0.03, -2.2], [-0.8, 0.03, -2.0], [-1.4, 0.03, -1.8]], color: COLORS.violet, speed: 0.15 },
    ],
    [],
  );
  const curves = useMemo(() => runs.map((r) => new THREE.CatmullRomCurve3(r.pts.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.4)), [runs]);
  const pulses = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    curves.forEach((c, i) => {
      const m = pulses.current[i];
      if (!m) return;
      const t = (clock.elapsedTime * runs[i].speed + i * 0.33) % 1;
      m.position.copy(c.getPointAt(t));
      m.position.y += 0.02;
    });
  });

  return (
    <group>
      {curves.map((c, i) => (
        <group key={i}>
          <mesh>
            <tubeGeometry args={[c, 48, 0.022, 8, false]} />
            <meshStandardMaterial color="#0c0d14" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh ref={(el) => { pulses.current[i] = el; }}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshBasicMaterial color={neon(runs[i].color, 4)} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
