export type HotspotId = 'desk' | 'rack' | 'hologram';
export type Vec3 = [number, number, number];

export interface HotspotItem {
  name: string;
  detail: string;
  tags?: string[];
  href?: string;
}

export interface Hotspot {
  id: HotspotId;
  title: string;
  /** Comando "finto" mostrato nel pannello terminale */
  command: string;
  description: string;
  items: HotspotItem[];
  /**
   * Posa della camera quando l'oggetto è selezionato.
   * Target e posizione sono traslati lateralmente di ~0.6-0.8 unità
   * così l'oggetto resta a sinistra e non finisce sotto il pannello UI.
   */
  camera: { position: Vec3; target: Vec3 };
}

// TODO: sostituisci con i tuoi contenuti reali
export const HOTSPOTS: Record<HotspotId, Hotspot> = {
  desk: {
    id: 'desk',
    title: 'Workstation',
    command: 'ls ~/progetti',
    description: 'Progetti open source e side project, dal più recente.',
    items: [
      { name: 'Nimbus Cloud', detail: '🌥️ Piattaforma di archiviazione cloud personale — React + Node.js + PostgreSQL. Caricamento file, cartelle nidificate, link di condivisione, ripristino password con OTP, avatar, chat di supporto in tempo reale. Self-hosted e mobile-first.', tags: ['react', 'node'], href: 'https://github.com/sickkkalex/NimbusCloud' },
      { name: 'MyBooks', detail: '📚 Libreria desktop per leggere, annotare e studiare PDF, EPUB e documenti universitari. Evidenzia, scrivi a mano, crea appunti e schede di studio. Python + Flask + SQLite, tutto in locale.', tags: ['python', 'sqlite'], href: 'https://github.com/sickkkalex/MyBooks' },
    ],
    camera: { position: [0.96, 1.8, 0.28], target: [-1.16, 1.35, -1.84] },
  },
  rack: {
    id: 'rack',
    title: 'Server rack',
    command: 'cat ~/infra/stack.md',
    description: 'Backend, infrastruttura e strumenti che uso ogni giorno.',
    items: [
      { name: 'Node.JS', detail: 'API REST e GraphQL, code, caching.' },
      { name: 'DevOps', detail: 'CI/CD, container, osservabilità.', tags: ['docker', 'github actions', 'terraform'] },
      { name: 'Database', detail: 'Modellazione e ottimizzazione query.', tags: ['postgres', 'sqlite'] },
    ],
    camera: { position: [5.74, 1.8, -0.8], target: [2.77, 1.1, -3.77] },
  },
  hologram: {
    id: 'hologram',
    title: 'Laboratorio',
    command: 'cat ~/lab/esperimenti.md',
    description: 'Grafica 3D, shader e creative coding.',
    items: [
      { name: '3D Portfolio Room', detail: 'Stanza 3D', tags: ['three.js', 'glsl'], href: 'https://github.com/tuo-utente/shaders' },
    ],
    camera: { position: [4.25, 1.9, 2.95], target: [2.15, 1.5, 0.85] },
  },
};
