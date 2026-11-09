import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Interactive } from '../Interactive';
import { COLORS, neon } from '@/lib/theme';
import { LedStrip, NeonPath } from './Neon';

const LEGS: [number, number][] = [[-1.1, -0.45], [1.1, -0.45], [-1.1, 0.45], [1.1, 0.45]];
// Righe di "codice" finto: [larghezza, y, x]
const CODE_LINES: [number, number, number][] = [
  [0.5, 0.18, -0.2], [0.7, 0.1, -0.1], [0.35, 0.02, 0], [0.6, -0.06, -0.1], [0.45, -0.14, -0.15],
];

const KEY_COLS = 14;
const KEY_ROWS = 4;

/** Tastiera RGB: un InstancedMesh, colori che scorrono come un arcobaleno. */
function Keyboard() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    let i = 0;
    for (let r = 0; r < KEY_ROWS; r++) {
      for (let c = 0; c < KEY_COLS; c++) {
        dummy.position.set((c - KEY_COLS / 2 + 0.5) * 0.035, 0.012, (r - KEY_ROWS / 2 + 0.5) * 0.035);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    let i = 0;
    for (let r = 0; r < KEY_ROWS; r++) {
      for (let c = 0; c < KEY_COLS; c++) {
        col.setHSL((t * 0.12 + c * 0.04 + r * 0.02) % 1, 1, 0.5).multiplyScalar(2.2);
        m.setColorAt(i++, col);
      }
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group position={[0, 0.79, 0.24]} rotation={[0, 0.05, 0]}>
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[0.54, 0.015, 0.18]} />
        <meshStandardMaterial color="#0b0c13" roughness={0.4} metalness={0.6} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, KEY_COLS * KEY_ROWS]} frustumCulled={false}>
        <boxGeometry args={[0.028, 0.012, 0.028]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/** Sedia gaming: sedile, schienale con bordo neon, base a stella. */
function Chair() {
  return (
    <group position={[0.95, 0, 1.15]} rotation={[0, -0.75, 0]}>
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.52, 0.08, 0.52]} />
        <meshStandardMaterial color="#14161f" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.98, 0.27]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.09]} />
        <meshStandardMaterial color="#14161f" roughness={0.6} metalness={0.2} />
      </mesh>
      <NeonPath points={[[-0.22, 0.62, 0.325], [-0.22, 1.36, 0.28], [0.22, 1.36, 0.28], [0.22, 0.62, 0.325]]} color={COLORS.magenta} radius={0.012} intensity={3} />
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 10]} />
        <meshStandardMaterial color="#0c0d14" metalness={0.8} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.22, 0.05, Math.sin((i / 5) * Math.PI * 2) * 0.22]} rotation={[0, -(i / 5) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.46, 0.03, 0.05]} />
          <meshStandardMaterial color="#0c0d14" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/** Torre PC sotto la scrivania: pannello in vetro con ventola RGB che gira. */
function Tower() {
  const fan = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (fan.current) fan.current.rotation.z += delta * 6;
    const m = fan.current?.children[0] as THREE.Mesh | undefined;
    if (m) (m.material as THREE.MeshBasicMaterial).color.setHSL((clock.elapsedTime * 0.2) % 1, 1, 0.55).multiplyScalar(2.4);
  });
  return (
    <group position={[0.8, 0.26, -0.15]}>
      <mesh castShadow>
        <boxGeometry args={[0.24, 0.5, 0.48]} />
        <meshStandardMaterial color="#0d0e16" roughness={0.4} metalness={0.6} />
      </mesh>
      <group ref={fan} position={[0.125, 0.05, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <torusGeometry args={[0.1, 0.012, 8, 28]} />
          <meshBasicMaterial toneMapped={false} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]} position={[0, 0, 0]}>
            <boxGeometry args={[0.02, 0.18, 0.004]} />
            <meshBasicMaterial color={neon(COLORS.cyan, 1.2)} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Scrivania con monitor. Hover: il monitor passa da cyan a viola e cresce leggermente. */
export function Desk() {
  return (
    <Interactive id="desk" position={[-1.8, 0, -1.2]} rotation={[0, Math.PI / 4, 0]} beaconY={2.25}>
      {({ hovered, active }) => {
        const on = hovered || active;
        const color = on ? COLORS.violet : COLORS.cyan;
        const glow = on ? 2.2 : 1.1;
        const screen = neon(color, 0.5 * glow, 0);
        const lines = neon(color, 2.4 + (on ? 1.2 : 0), 0.25);
        return (
          <>
            {/* Piano e gambe */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.4, 0.08, 1.1]} />
              <meshStandardMaterial color="#1a1c28" roughness={0.45} metalness={0.35} />
            </mesh>
            {LEGS.map(([x, z]) => (
              <mesh key={`${x}${z}`} position={[x, 0.36, z]} castShadow>
                <boxGeometry args={[0.07, 0.72, 0.07]} />
                <meshStandardMaterial color="#0f111a" roughness={0.7} metalness={0.4} />
              </mesh>
            ))}
            {/* Luce sotto il piano */}
            <LedStrip position={[0, 0.7, 0.52]} size={[2.3, 0.02, 0.02]} color={COLORS.violet} intensity={3} />
            <LedStrip position={[0, 0.7, -0.52]} size={[2.3, 0.02, 0.02]} color={COLORS.cyan} intensity={2.4} />

            {/* Monitor: base, braccio, cornice */}
            <mesh position={[0, 0.8, -0.1]} castShadow>
              <boxGeometry args={[0.4, 0.02, 0.25]} />
              <meshStandardMaterial color="#0f111a" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.98, -0.12]} castShadow>
              <boxGeometry args={[0.06, 0.35, 0.05]} />
              <meshStandardMaterial color="#0f111a" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.42, -0.12]} castShadow>
              <boxGeometry args={[1.25, 0.7, 0.05]} />
              <meshStandardMaterial color="#0a0b11" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Cornice luminosa sul bordo del monitor */}
            <LedStrip position={[0, 1.775, -0.09]} size={[1.25, 0.012, 0.012]} color={color} intensity={3} />
            <LedStrip position={[0, 1.065, -0.09]} size={[1.25, 0.012, 0.012]} color={color} intensity={3} />
            <LedStrip position={[-0.625, 1.42, -0.09]} size={[0.012, 0.7, 0.012]} color={color} intensity={3} />
            <LedStrip position={[0.625, 1.42, -0.09]} size={[0.012, 0.7, 0.012]} color={color} intensity={3} />

            {/* Schermo */}
            <mesh position={[0, 1.42, -0.092]}>
              <planeGeometry args={[1.15, 0.6]} />
              <meshBasicMaterial color={screen} toneMapped={false} />
            </mesh>
            {CODE_LINES.map(([w, y, x], i) => (
              <mesh key={i} position={[x - 0.2, 1.42 + y, -0.09]}>
                <planeGeometry args={[w, 0.035]} />
                <meshBasicMaterial color={lines} toneMapped={false} />
              </mesh>
            ))}

            {/* Secondo monitor verticale (log) */}
            <group position={[-0.95, 0, -0.02]} rotation={[0, 0.55, 0]}>
              <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[0.05, 0.24, 0.05]} />
                <meshStandardMaterial color="#0f111a" metalness={0.5} roughness={0.4} />
              </mesh>
              <mesh position={[0, 1.3, 0]} castShadow>
                <boxGeometry args={[0.46, 0.72, 0.04]} />
                <meshStandardMaterial color="#0a0b11" roughness={0.4} metalness={0.3} />
              </mesh>
              <mesh position={[0, 1.3, 0.022]}>
                <planeGeometry args={[0.4, 0.66]} />
                <meshBasicMaterial color={neon(COLORS.magenta, 0.35, 0)} toneMapped={false} />
              </mesh>
              {[0.25, 0.15, 0.05, -0.05, -0.15, -0.25].map((y, i) => (
                <mesh key={y} position={[-0.04 + (i % 3) * 0.02, 1.3 + y, 0.024]}>
                  <planeGeometry args={[0.26 - (i % 3) * 0.06, 0.02]} />
                  <meshBasicMaterial color={neon(i % 2 ? COLORS.magenta : COLORS.amber, 2.4)} toneMapped={false} />
                </mesh>
              ))}
            </group>

            <Keyboard />

            {/* Mousepad + mouse */}
            <mesh position={[0.62, 0.797, 0.24]}>
              <boxGeometry args={[0.4, 0.006, 0.28]} />
              <meshStandardMaterial color="#0c0d14" roughness={0.9} />
            </mesh>
            <NeonPath points={[[0.42, 0.803, 0.38], [0.82, 0.803, 0.38], [0.82, 0.803, 0.1], [0.42, 0.803, 0.1]]} color={COLORS.magenta} radius={0.004} intensity={3} closed />
            <mesh position={[0.62, 0.815, 0.24]}>
              <capsuleGeometry args={[0.025, 0.04, 4, 10]} />
              <meshStandardMaterial color="#1a1c28" roughness={0.4} metalness={0.5} />
            </mesh>

            {/* Lampada da scrivania (ambra) */}
            <group position={[-1.0, 0.79, 0.15]}>
              <mesh position={[0, 0.01, 0]}>
                <cylinderGeometry args={[0.09, 0.1, 0.02, 16]} />
                <meshStandardMaterial color="#10121c" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.22, 0]} rotation={[0, 0, 0.25]}>
                <cylinderGeometry args={[0.008, 0.008, 0.44, 8]} />
                <meshStandardMaterial color="#10121c" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0.1, 0.43, 0]} rotation={[0, 0, 1.1]}>
                <coneGeometry args={[0.08, 0.14, 16, 1, true]} />
                <meshStandardMaterial color="#10121c" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[0.13, 0.4, 0]}>
                <sphereGeometry args={[0.03, 10, 10]} />
                <meshBasicMaterial color={neon(COLORS.amber, 3.5)} toneMapped={false} />
              </mesh>
            </group>

            {/* Tazza con vapore */}
            <group position={[1.05, 0.79, -0.05]}>
              <mesh position={[0, 0.045, 0]}>
                <cylinderGeometry args={[0.04, 0.035, 0.09, 14]} />
                <meshStandardMaterial color="#e9e6f5" roughness={0.4} />
              </mesh>
              <Sparkles count={6} scale={[0.08, 0.22, 0.08]} position={[0, 0.2, 0]} size={1.6} speed={0.5} opacity={0.5} color="#ffffff" />
            </group>

            <Tower />
            <Chair />

            {/* Bagliore del monitor sulla scrivania */}
            <pointLight position={[0, 1.2, 0.5]} color={color} intensity={glow * 3} distance={3.5} />
          </>
        );
      }}
    </Interactive>
  );
}
