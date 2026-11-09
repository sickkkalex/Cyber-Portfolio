import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import { useExplorer } from '@/store/useExplorer';
import { COLORS } from '@/lib/theme';

/** Monta il <Canvas>. Tutto ciò che sta dentro vive nel mondo R3F. */
export function Scene() {
  const clear = useExplorer((s) => s.clear);

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.75]}
      // flat: il tone mapping lo fa l'effetto ACES nel composer (serve per il Bloom HDR)
      flat
      // parte lontana: la camera "vola" verso la posa iniziale dopo ENTER
      camera={{ position: [14, 10, 14], fov: 35, near: 0.1, far: 80 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      // click nel vuoto = torna alla vista d'insieme
      onPointerMissed={clear}
    >
      <color attach="background" args={[COLORS.void]} />
      <fog attach="fog" args={[COLORS.void, 22, 46]} />
      <Experience />
    </Canvas>
  );
}
