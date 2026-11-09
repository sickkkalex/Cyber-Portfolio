import { useEffect } from 'react';
import { Scene } from './canvas/Scene';
import { Hud } from './ui/Hud';
import { DetailPanel } from './ui/DetailPanel';
import { BootScreen } from './ui/BootScreen';
import { useExplorer } from './store/useExplorer';

export default function App() {
  const clear = useExplorer((s) => s.clear);

  // Esc = torna alla vista d'insieme
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && clear();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clear]);

  return (
    <main className="relative h-full w-full">
      <div className="absolute inset-0">
        <Scene />
      </div>
      <Hud />
      <DetailPanel />
      <div className="crt" aria-hidden />
      <BootScreen />
    </main>
  );
}
