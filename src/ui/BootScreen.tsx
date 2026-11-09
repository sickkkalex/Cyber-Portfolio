import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExplorer } from '@/store/useExplorer';

const LINES = [
  '[ OK ] mount /dev/portfolio',
  '[ OK ] calibrating neon tubes ........ 100%',
  '[ OK ] loading city skyline + rain',
  '[ OK ] spawning drone-01',
  '[ OK ] rendering room',
];

/** Schermata d'ingresso: dà il tempo di caricare, e il click sblocca audio e volo di camera. */
export function BootScreen() {
  const entered = useExplorer((s) => s.entered);
  const enter = useExplorer((s) => s.enter);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= LINES.length) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), 320);
    return () => window.clearTimeout(id);
  }, [shown]);

  const ready = shown >= LINES.length;

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void px-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="glitch neon-cyan flicker font-display text-4xl font-bold tracking-tight md:text-6xl" data-text="Il tuo Nome">
            Alessio Saulli
          </h1>
          <p className="neon-magenta mt-2 text-sm tracking-[0.35em] md:text-base">PORTFOLIO // 2026</p>

          <ul className="mt-10 h-28 w-full max-w-md space-y-1 text-left text-xs text-ink-dim">
            {LINES.slice(0, shown).map((l) => (
              <li key={l}>
                <span className="text-lime-300/90">{l.slice(0, 6)}</span>
                {l.slice(6)}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col items-center gap-3">
            <button
              disabled={!ready}
              onClick={() => enter(true)}
              className="neon-box-cyan neon-cyan border-0 bg-cyan-neon/5 px-8 py-3 text-sm tracking-[0.3em] transition disabled:opacity-30 enabled:hover:bg-cyan-neon/15"
            >
              ENTRA NELLA STANZA
            </button>
            <button
              disabled={!ready}
              onClick={() => enter(false)}
              className="text-xs text-ink-dim underline-offset-4 transition hover:text-white hover:underline disabled:opacity-0"
            >
              entra senza audio
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
