import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { neon } from '@/lib/theme';
import type { Vec3 } from '@/data/hotspots';

interface NeonProps {
  points: Vec3[];
  color: string;
  radius?: number;
  intensity?: number;
  /** true = curva morbida (cerchi, onde); false = segmenti con spigoli netti */
  smooth?: boolean;
  closed?: boolean;
  /** Sfarfallio da insegna difettosa */
  flicker?: boolean;
  /** Fase per sfalsare i flicker tra più insegne */
  phase?: number;
}

const UP = new THREE.Vector3(0, 1, 0);

/** Tubo al neon: geometria sottile con materiale emissivo HDR (il Bloom fa il resto). */
export function NeonPath({ points, color, radius = 0.02, intensity = 3, smooth = false, closed = false, flicker = false, phase = 0 }: NeonProps) {
  const base = useMemo(() => neon(color, intensity), [color, intensity]);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: base, toneMapped: false }), [base]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    let f = 1;
    if (flicker) {
      const t = clock.elapsedTime + phase;
      f = Math.sin(t * 41) * Math.sin(t * 9.7) > 0.88 ? 0.12 : 1;
      f *= 0.94 + Math.sin(t * 120) * 0.06;
    }
    material.color.copy(base).multiplyScalar(f);
  });

  const geo = useMemo(() => {
    const pts = points.map((p) => new THREE.Vector3(...p));
    if (smooth) {
      const curve = new THREE.CatmullRomCurve3(pts, closed, 'catmullrom', 0.5);
      return { tube: new THREE.TubeGeometry(curve, Math.max(24, pts.length * 8), radius, 8, closed), segs: [] as { pos: THREE.Vector3; quat: THREE.Quaternion; len: number }[], pts };
    }
    const segs: { pos: THREE.Vector3; quat: THREE.Quaternion; len: number }[] = [];
    const n = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const dir = b.clone().sub(a);
      segs.push({
        pos: a.clone().add(b).multiplyScalar(0.5),
        quat: new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
        len: dir.length(),
      });
    }
    return { tube: null as THREE.TubeGeometry | null, segs, pts };
  }, [points, smooth, closed, radius]);

  return (
    <group>
      {geo.tube && <mesh geometry={geo.tube} material={material} />}
      {geo.segs.map((s, i) => (
        <mesh key={i} position={s.pos} quaternion={s.quat} material={material}>
          <cylinderGeometry args={[radius, radius, s.len, 8]} />
        </mesh>
      ))}
      {!smooth &&
        geo.pts.map((p, i) => (
          <mesh key={`j${i}`} position={p} material={material}>
            <sphereGeometry args={[radius, 8, 8]} />
          </mesh>
        ))}
    </group>
  );
}

/** Punti di un cerchio nel piano XY (per anelli neon). */
export function circlePoints(r: number, n = 40): Vec3[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.cos(a) * r, Math.sin(a) * r, 0] as Vec3;
  });
}

/** Striscia LED rettilinea (battiscopa, bordi): box emissivo sottile. */
export function LedStrip({ position, size, color, intensity = 2.5 }: { position: Vec3; size: Vec3; color: string; intensity?: number }) {
  const c = useMemo(() => neon(color, intensity, 0.2), [color, intensity]);
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={c} toneMapped={false} />
    </mesh>
  );
}
