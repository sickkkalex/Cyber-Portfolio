import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HOTSPOTS } from '@/data/hotspots';
import { useExplorer } from '@/store/useExplorer';

/** Scrive il testo carattere per carattere, come un terminale. */
function useTypewriter(text: string, speed = 28) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = window.setInterval(() => setN((v) => (v >= text.length ? (window.clearInterval(id), v) : v + 1)), speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return text.slice(0, n);
}

function Command({ text }: { text: string }) {
  const typed = useTypewriter(text);
  return (
    <p className="text-cyan-neon">
      <span className="text-magenta-neon">$</span> {typed}
      <span className="caret">▍</span>
    </p>
  );
}

/** Pannello in stile terminale. Bottom sheet su mobile, colonna a destra da md in su. */
export function DetailPanel() {
  const selected = useExplorer((s) => s.selected);
  const clear = useExplorer((s) => s.clear);
  const spot = selected ? HOTSPOTS[selected] : null;

  return (
    <AnimatePresence mode="wait">
      {spot && (
        <motion.aside
          key={spot.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="neon-box-violet fixed inset-x-0 bottom-0 z-10 flex h-[52vh] flex-col bg-void/80 backdrop-blur-md md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[26rem]"
          aria-label={spot.title}
        >
          <div className="flex items-center justify-between border-b border-violet-neon/30 px-4 py-3 text-xs text-ink-dim">
            <span>
              <span className="text-lime-300">●</span> ~/portfolio/{spot.id}
            </span>
            <button onClick={clear} aria-label="Chiudi pannello" className="px-2 transition-colors hover:text-white">
              esc
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 text-sm leading-relaxed">
            <Command text={spot.command} />
            <h2 className="neon-cyan mt-4 font-display text-2xl font-bold">{spot.title}</h2>
            <p className="mt-2 max-w-[60ch] text-ink-dim">{spot.description}</p>

            <ul className="mt-6 space-y-5">
              {spot.items.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.35 }}
                  className="border-l-2 border-magenta-neon/60 pl-3 shadow-[-8px_0_16px_-12px_#ff2bd6]"
                >
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-ink-dim">{item.detail}</p>
                  {item.tags && <p className="mt-1 text-xs text-cyan-neon/90">{item.tags.map((t) => `[${t}]`).join(' ')}</p>}
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs text-violet-neon underline-offset-4 hover:text-magenta-neon hover:underline"
                    >
                      Apri su GitHub
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
