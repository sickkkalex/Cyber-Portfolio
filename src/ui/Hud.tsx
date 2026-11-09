import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HOTSPOTS } from '@/data/hotspots';
import { useExplorer } from '@/store/useExplorer';

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span>{now.toLocaleTimeString('it-IT')}</span>;
}

/** Angolo a "mirino" per il frame HUD. */
function Corner({ className }: { className: string }) {
  return <span aria-hidden className={`pointer-events-none fixed h-5 w-5 border-cyan-neon/70 ${className}`} />;
}

/** Overlay fisso: identità, suggerimento d'uso, stato, audio, etichetta dell'oggetto sotto il cursore. */
export function Hud() {
  const hovered = useExplorer((s) => s.hovered);
  const selected = useExplorer((s) => s.selected);
  const entered = useExplorer((s) => s.entered);
  const sound = useExplorer((s) => s.sound);
  const toggleSound = useExplorer((s) => s.toggleSound);
  const clear = useExplorer((s) => s.clear);

  if (!entered) return null;

  return (
    <>
      <Corner className="left-2 top-2 border-l border-t" />
      <Corner className="right-2 top-2 border-r border-t" />
      <Corner className="bottom-2 left-2 border-b border-l" />
      <Corner className="bottom-2 right-2 border-b border-r" />

      <header className="pointer-events-none fixed left-5 top-5 md:left-8 md:top-7">
        {/* TODO: il tuo nome e ruolo */}
        <h1 className="neon-cyan font-display text-xl font-bold tracking-tight md:text-2xl">Alessio Saulli</h1>
        <p className="mt-1 text-xs text-ink-dim">Web Developer Full Stack · github.com/sickkkalex</p>
      </header>

      {/* Stato + audio: si sposta a sinistra del pannello quando è aperto */}
      <div
        className={`fixed top-5 z-20 flex items-center gap-4 text-xs text-ink-dim transition-all md:top-7 ${
          selected ? 'right-5 md:right-[27.5rem]' : 'right-5 md:right-8'
        }`}
      >
        <span className="hidden items-center gap-2 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300 shadow-[0_0_8px_#7dff6b]" />
          ONLINE · <Clock />
        </span>
        <button
          onClick={toggleSound}
          aria-pressed={sound}
          className={`border px-2.5 py-1 transition-colors ${sound ? 'neon-box-cyan text-cyan-neon' : 'border-white/10 hover:text-white'}`}
        >
          audio {sound ? 'on' : 'off'}
        </button>
      </div>

      <div className="pointer-events-none fixed bottom-5 left-5 md:bottom-7 md:left-8">
        {selected ? (
          <button
            onClick={clear}
            className="neon-box-cyan pointer-events-auto bg-void/70 px-3 py-2 text-xs text-cyan-neon backdrop-blur transition-colors hover:bg-cyan-neon/10"
          >
            Torna alla stanza (Esc)
          </button>
        ) : (
          <p className="text-xs text-ink-dim">
            Trascina per ruotare · scrolla per zoomare · clicca i ◆ per aprire
            <span className="caret ml-1 text-cyan-neon">_</span>
          </p>
        )}
      </div>

      <AnimatePresence>
        {hovered && !selected && (
          <motion.div
            key={hovered}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="neon-box-violet neon-magenta pointer-events-none fixed bottom-16 left-1/2 -translate-x-1/2 bg-void/80 px-4 py-1.5 text-sm backdrop-blur md:bottom-8"
          >
            {HOTSPOTS[hovered].title}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
