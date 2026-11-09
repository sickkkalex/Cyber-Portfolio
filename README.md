<div align="center">

# Cyber Portfolio v2

**Portfolio personale in 3D interattivo: esplora una stanza virtuale (scrivania, server rack, laboratorio) e apri i dettagli di progetti, stack e link da hotspot cliccabili. Tutto nel browser, nessun backend, nessun database.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![framer-motion](https://img.shields.io/badge/Animate-framer--motion-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![zustand](https://img.shields.io/badge/State-zustand-F59E0B?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Demo](#) · [Segnala un Bug](issues) · [Richiedi una Feature](issues)

</div>

---

## 👁️ Panoramica

**Cyber Portfolio v2** è un portfolio personale in 3D, interamente lato client, per sviluppatori e professionisti tech. Al posto della classica pagina statica, il visitatore esplora una "stanza" virtuale (stile sala server / workstation) costruita con Three.js e React Three Fiber: ogni oggetto nella scena è un **hotspot cliccabile** che apre un pannello in stile terminale con descrizione dei progetti, tag tecnologici e link esterni.

Nessun backend, nessun database, nessun asset esterno: tutto gira nel browser, è leggero e si deploya ovunque (GitHub Pages, Vercel, Netlify, Cloudflare Pages…).

---

## ✨ Funzionalità

| Funzionalità | Descrizione |
|---|---|
| 🏠 **Scena 3D interattiva** | Stanza con scrivania, server rack e laboratorio; luci con ombre, nebbia e luci puntate colorate |
| 🎯 **Hotspot cliccabili** | Oggetti nella scena con raycaster, cursore personalizzato, scala al hover e faro neon pulsante |
| 🎥 **Volo della camera** | Transizione fluida (lerp esponenziale) tra vista d'insieme e primo piano dell'oggetto selezionato; OrbitControls per ruotare e zoomare liberamente |
| 🖥️ **Pannello dettaglio terminale** | Effetto typewriter, comando fake (es. `$ ls ~/progetti`), elenco item con tag e link esterni |
| 🧭 **HUD fissa** | Nome e ruolo, orologio in tempo reale, stato online, indicazioni d'uso, togglo audio |
| 🔊 **Audio procedurale** | Drone ambient, pioggia e piccoli effetti UI generati con Web Audio API (nessun file audio) |
| 🖥️ **Schermata di boot** | Sequenza terminale simulata all'avvio, ingresso con o senza audio |
| 📺 **Overlay CRT** | Scanlines e vignettatura per l'estetica "vecchio monitor" |
| 🎨 **Tema neon** | Palette ciano, magenta, violetto su sfondo scuro; testi e box con effetto al neon |
| 📱 **Responsivo** | HUD e pannello si adattano da mobile a desktop |
| ✏️ **Contenuti in un unico file** | Tutti i dati della stanza stanno in `src/data/hotspots.ts` |

---

## 🛠️ Stack tecnologico

| Strato | Tecnologia | Ruolo |
|---|---|---|
| Framework | React 19 + TypeScript | UI e logica applicativa |
| Build tool | Vite 6 | Server di sviluppo, bundling, HMR |
| 3D | Three.js r170 + @react-three/fiber + @react-three/drei | Scena 3D dichiarativa |
| Post-processing | @react-three/postprocessing | Bloom HDR e tone mapping ACES |
| Animazioni | framer-motion | Transizioni UI, pannello, boot screen |
| Stato | zustand | Store unico (selezione, hover, audio, boot) |
| Styling | Tailwind CSS v4 + CSS custom properties | Utility class e design token neon |
| Audio | Web Audio API | Audio procedurale senza asset esterni |
| Font | JetBrains Mono + Space Grotesk | Tipografia mono + display (Google Fonts) |

---

## 📂 Struttura del progetto

```text
cyber-portfolio-v2/
├── index.html              # shell HTML, preconnect font, <div id="root">
├── package.json            # dipendenze e script
├── tsconfig.json           # TypeScript (paths @/* → src/*)
├── vite.config.ts          # Vite: plugin React + Tailwind, alias @/*
├── .gitignore
├── README.md
└── src/
    ├── main.tsx            # entry point: React StrictMode + App
    ├── App.tsx             # shell principale: Scene, Hud, DetailPanel, BootScreen, overlay CRT
    ├── index.css           # import Tailwind, token colore, animazioni (caret, flicker, glitch, crt)
    │
    ├── canvas/             # mondo Three.js (React Three Fiber)
    │   ├── Scene.tsx       # montaggio <Canvas>, background, nebbia
    │   ├── Experience.tsx  # luci, diorama, oggetti, post-processing
    │   ├── CameraRig.tsx   # OrbitControls + transizione camera overview ↔ focus
    │   ├── Interactive.tsx # wrapper riutilizzabile: raycast, hover, scala, beacon, store
    │   ├── objects/        # Room, CityWindow, LightShafts, WallDecor, Arcade, Cables, Drone, Desk, ServerRack, Hologram, Neon
    │   └── effects/        # Effects.tsx (pipeline bloom/post-processing)
    │
    ├── data/
    │   └── hotspots.ts     # contenuti: scrivania, rack, laboratorio (item, tag, link, pose camera)
    │
    ├── lib/
    │   ├── theme.ts        # palette colori condivisa CSS ↔ Three.js + helper neon HDR
    │   └── audio.ts        # Web Audio: drone, pioggia, sfx hover/select/back/boot
    │
    ├── store/
    │   └── useExplorer.ts  # Zustand: stato selezione, hover, boot, audio
    │
    └── ui/                 # componenti React dell'interfaccia
        ├── Hud.tsx         # overlay HUD: identità, orologio, audio, suggerimenti
        ├── DetailPanel.tsx # pannello terminale con typewriter e dettagli hotspot
        └── BootScreen.tsx  # schermata di avvio con sequenza boot simulata
```

---

## ⚡ Avvio rapido

### Prerequisiti

- [Node.js](https://nodejs.org/) 18+ (consigliato 20+)
- npm, pnpm o yarn

### 1. Clona il repository

```bash
git clone https://github.com/sickkkalex/cyber-portfolio-v2.git
cd cyber-portfolio-v2
```

### 2. Installa le dipendenze

```bash
npm install
# oppure
pnpm install
```

### 3. Avvia in sviluppo

```bash
npm run dev
```

L'app è disponibile su `http://localhost:5173` (default Vite). Premi **ENTRA NELLA STANZA** nella schermata di boot per accedere alla scena 3D.

### 4. Build di produzione

```bash
npm run build
# output in dist/
```

### 5. Anteprima locale della build

```bash
npm run preview
```

---

## 🎮 Come usare / navigare

| Azione | Tasto / Mouse |
|---|---|
| Entrare nella stanza | Clicca **ENTRA NELLA STANZA** (o *entra senza audio*) nella boot screen |
| Ruotare la vista | Click sinistro + trascina |
| Zoom | Scroll del mouse |
| Aprire un hotspot | Clicca l'oggetto con il ◆ neon fluttuante sopra |
| Tornare alla stanza | `Esc` oppure clicca "Torna alla stanza" |
| Attivare/disattivare audio | Bottone "audio on/off" in alto a destra |

---

## ✏️ Personalizzare i contenuti

Tutti i contenuti della stanza si trovano in un unico file:

`src/data/hotspots.ts`

Ogni hotspot definisce:

- `id` — identificativo usato dallo store e dalla camera
- `title` / `description` — titolo e descrizione mostrati nel pannello
- `command` — comando "finto" visualizzato nel pannello terminale (es. `ls ~/progetti`)
- `items` — elenco di elementi con `name`, `detail`, `tags` (opzionali) e `href` (link esterno/GitHub)
- `camera` — posizione e target della camera quando l'hotspot è selezionato (l'oggetto resta a sinistra del pannello)

Esempio:

```ts
export const HOTSPOTS: Record<HotspotId, Hotspot> = {
  desk: {
    id: 'desk',
    title: 'Workstation',
    command: 'ls ~/progetti',
    description: 'Progetti open source e side project, dal più recente.',
    items: [
      {
        name: 'Nome progetto',
        detail: 'Breve descrizione con lo stack usato.',
        tags: ['react', 'node'],
        href: 'https://github.com/tuo-utente/repo',
      },
    ],
    camera: { position: [1, 2, 1], target: [0, 0, 0] },
  },
  // ...
};
```

- **Identità header** (nome, ruolo, social): modifica `src/ui/Hud.tsx`
- **Palette colori**: `src/lib/theme.ts` (condivisa tra CSS e Three.js) e le variabili di `src/index.css`
- **Pose camera**: aggiorna il campo `camera` di ogni hotspot in `src/data/hotspots.ts`

---

## 📜 Script disponibili

| Script | Descrizione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo Vite con HMR |
| `npm run build` | Controllo TypeScript + build di produzione in `dist/` |
| `npm run preview` | Serve la build di produzione in locale per test |

---

## 🗺️ Roadmap

- [x] Scena 3D con Three.js + React Three Fiber
- [x] Hotspot interattivi e volo della camera
- [x] Pannello dettaglio in stile terminale
- [x] Audio procedurale (Web Audio API)
- [x] Schermata di boot e overlay CRT
- [ ] Aggiungere i tuoi progetti reali in `src/data/hotspots.ts`
- [ ] Più hotspot (libreria, certificazioni, contatti)
- [ ] Animazioni di ingresso per gli oggetti
- [ ] Supporto tema chiaro/scuro
- [ ] Internazionalizzazione (ITA/ENG)
- [ ] Deploy su GitHub Pages

---

## 🤝 Contribuire

I contributi sono i benvenuti:

1. Fai un **fork** del repository
2. Crea un branch: `git checkout -b feature/nuova-feature`
3. Apporta le modifiche e commita: `git commit -m 'feat: descrizione'`
4. Pusha il branch: `git push origin feature/nuova-feature`
5. Apri una **Pull Request**

---

## 📄 Licenza

Distribuito sotto licenza **MIT**. Vedi [`LICENSE`](LICENSE) per maggiori dettagli.

---

<div align="center">

Fatto con ❤️ da **Alessio Saulli**  
Web Developer Full Stack · github.com/sickkkalex

*Cyber Portfolio v2 — Stanza 3D, progetti e codice. Tutto nel browser.*

</div>
