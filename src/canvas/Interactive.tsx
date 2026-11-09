import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import type { HotspotId, Vec3 } from '@/data/hotspots';
import { useExplorer } from '@/store/useExplorer';
import { COLORS, neon } from '@/lib/theme';

interface InteractiveProps {
  id: HotspotId;
  position?: Vec3;
  rotation?: Vec3;
  /** Scala raggiunta in hover */
  hoverScale?: number;
  /** Altezza (locale) del marcatore pulsante sopra l'oggetto; omesso = nessun marcatore */
  beaconY?: number;
  /** Render prop: i figli ricevono lo stato per cambiare colore/emissione */
  children: (state: { hovered: boolean; active: boolean }) => ReactNode;
}

/** Diamante neon che fluttua e pulsa sopra l'oggetto: invita al click, sparisce quando è aperto. */
function Beacon({ y, hovered, visible }: { y: number; hovered: boolean; visible: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    g.current.position.y = y + Math.sin(t * 2.2) * 0.07;
    g.current.rotation.y += delta * (hovered ? 4 : 1.4);
    const target = visible ? (hovered ? 1.5 : 1 + Math.sin(t * 3) * 0.12) : 0.0001;
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, target, 8, delta));
  });
  return (
    <group ref={g} position={[0, y, 0]}>
      <mesh>
        <octahedronGeometry args={[0.1, 0]} />
        <meshBasicMaterial color={neon(hovered ? COLORS.magenta : COLORS.cyan, 3.2)} toneMapped={false} wireframe />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.05, 0]} />
        <meshBasicMaterial color={neon(hovered ? COLORS.magenta : COLORS.cyan, 4)} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * Wrapper riusabile per qualunque oggetto cliccabile: raycasting (eventi R3F),
 * cursore, scala in hover e sincronizzazione con lo store.
 * L'origine del gruppo è la base dell'oggetto, quindi la scala "cresce" dal pavimento.
 */
export function Interactive({ id, position, rotation, hoverScale = 1.035, beaconY, children }: InteractiveProps) {
  const group = useRef<THREE.Group>(null);
  const hovered = useExplorer((s) => s.hovered === id);
  const active = useExplorer((s) => s.selected === id);
  const setHovered = useExplorer((s) => s.setHovered);
  const select = useExplorer((s) => s.select);

  useCursor(hovered);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered && !active ? hoverScale : 1;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, target, 10, delta));
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation(); // reagisce solo l'oggetto più vicino alla camera
        setHovered(id);
      }}
      onPointerOut={() => setHovered(null)}
      onClick={(e) => {
        e.stopPropagation();
        if (!active) select(id);
      }}
    >
      {children({ hovered, active })}
      {beaconY !== undefined && <Beacon y={beaconY} hovered={hovered} visible={!active} />}
    </group>
  );
}
