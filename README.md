<div align="center">

# Cyber Portfolio

**Il tuo portfolio di sicurezza informatica: progetti, write-up, certificazioni e strumenti. Locale, professionale, sempre aggiornato.**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=white)](https://developer.mozilla.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/tests-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r168-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)

[Demo](#) · [Segnala un Bug](issues) · [Richiedi una Feature](issues)

</div>

---

## ✨ Panoramica

**Cyber Portfolio** è un portfolio personale full-stack per professionisti e studenti di cybersecurity: raccogli progetti, write-up di CTF, certificazioni, strumenti di sicurezza e articoli tecnici in un'unica applicazione locale. Backend Python, frontend HTML/CSS/JS, tutto in locale e sotto il tuo controllo.

> 🏠 **Niente account, niente cloud.** I tuoi dati, i tuoi progetti e i tuoi write-up restano sul tuo computer.

---

## 🚀 Funzionalità

| Funzionalità | Descrizione |
|---|---|
| 🛡️ **Gestione progetti** | Schede progetto con descrizione, categoria, stato, link esterni, repository GitHub e immagini di copertina |
| 🏁 **Write-up CTF** | Archiviazione di write-up con piattaforma, sfida, categoria, difficoltà, soluzione, flag e riferimenti |
| 📜 **Certificazioni** | Catalogo certificazioni con ente certificatore, data, scadenza, ID credenziale e link di verifica |
| 🛠️ **Strumenti di sicurezza** | Elenco strumenti personali con descrizione, utilizzo, repository e tag per rapida consultazione |
| 📝 **Blog tecnico** | Articoli in Markdown con bozze, pubblicazione, slug, excerpt e indicizzazione full-text |
| 🔍 **Ricerca full-text** | Motore FTS5 su progetti, write-up, certificazioni, strumenti, blog e metadati |
| 🎨 **Tema chiaro e scuro** | Interfaccia ispirata ai tool di sicurezza, con animazioni e transizioni fluide |
| ✒️ **Tipografia regolabile** | Dimensione carattere, font (serif/sans/mono), interlinea e modalità lettura |
| 📊 **Statistiche** | Progetti, write-up, certificazioni, articoli e grafico attività nel tempo |
| 💾 **Esportazione portfolio** | Esporta l'intero portfolio in PDF, Markdown o JSON per backup o condivisione |
| 🔗 **Link pubblici** | Genera link condivisibili a singole sezioni o al portfolio completo |
| ⌨️ **Scorciatoie** | Combinazioni rapide per navigazione, ricerca e creazione contenuti |

---

## 🛠️ Stack Tecnologico

### Frontend
```
HTML5 + CSS3 (custom properties, glassmorphism, animazioni spring)
JavaScript ES6 vanilla — zero build step, zero dipendenze
Tailwind CSS utility classes · Canvas per anteprime
pywebview (ponte nativo per i dialog di sistema)
```

### Backend
```
Python 3.11+ · Flask 3 (API REST + hosting del frontend)
SQLite 3 con WAL e indice FTS5 (ricerca full-text)
Markdown · Pillow (copertine e anteprime)
```

### Infrastruttura
```
pywebview — finestra desktop nativa (Linux/macOS/Windows)
PyInstaller — pacchetto standalone `dist/CyberPortfolio`
Flask dev server — modalità browser per lo sviluppo
```

---

## 🏗️ Architettura

```
CyberPortfolio/
├── backend/                    # API Python (Flask)
│   ├── app.py                  # route: portfolio, write-up, certificazioni, blog, export
│   ├── db.py                   # schema SQLite + FTS5
│   ├── projects.py             # gestione progetti sicurezza
│   ├── writeups.py             # write-up CTF e soluzioni
│   ├── certifications.py       # certificazioni e credenziali
│   ├── tools.py                # catalogo strumenti di sicurezza
│   ├── blog.py                 # articoli tecnici in Markdown
│   ├── contact.py              # messaggi di contatto
│   ├── search.py               # ricerca globale FTS5
│   ├── export.py               # esportazione PDF/Markdown/JSON
│   ├── config.py               # percorsi e costanti
│   └── docs/                   # gestori per formato file
│       ├── base.py             # interfaccia comune
│       └── markdown.py         # parsing articoli blog
├── frontend/                   # interfaccia (vanilla JS, zero build)
│   ├── index.html              # shell dell'applicazione
│   ├── public/logo.svg         # logo
│   ├── css/
│   │   ├── theme.css           # token, colori, animazioni, modali
│   │   ├── portfolio.css       # griglia progetti, schede, statistiche
│   │   ├── writeups.css        # vista write-up, evidenziazione codice
│   │   ├── tools.css           # catalogo strumenti e filtri
│   │   └── blog.css            # articoli, lettura, archivio
│   └── js/
│       ├── api.js              # client HTTP
│       ├── utils.js            # helper DOM e formattazione
│       ├── ui.js               # modali, toast, conferme
│       ├── store.js            # stato applicativo + bus eventi
│       ├── portfolio.js        # vista progetti
│       ├── writeups.js         # sezione write-up CTF
│       ├── certifications.js   # sezione certificazioni
│       ├── tools.js            # sezione strumenti
│       ├── blog.js             # sezione blog e articoli
│       ├── search.js           # ricerca globale
│       ├── contact.js          # form di contatto
│       ├── reader.js           # controller lettore Markdown
│       └── app.js              # routing e avvio
├── desktop.py                  # app desktop (pywebview + Flask in background)
├── run.py                      # solo server, per il browser
├── main.spec                   # pacchetto PyInstaller
├── install.sh                  # installazione come app desktop (Linux)
├── make_samples.py             # genera contenuti di esempio
├── tests/                      # suite end-to-end Playwright
└── data/                       # runtime: database, contenuti, esportazioni
```

---

## 📊 Schema Database

```sql
CREATE TABLE projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category    TEXT NOT NULL DEFAULT '',   -- web | network | mobile | reversing | malware | other
    status      TEXT NOT NULL DEFAULT 'active', -- active | archived | completed
    link        TEXT DEFAULT '',
    github      TEXT DEFAULT '',
    cover       TEXT DEFAULT '',
    featured    INTEGER NOT NULL DEFAULT 0,
    tags        TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);

CREATE TABLE writeups (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    platform    TEXT NOT NULL DEFAULT '',   -- HTB | TryHackMe | CTF | other
    challenge   TEXT NOT NULL DEFAULT '',
    category    TEXT NOT NULL DEFAULT '',   -- web | pwn | rev | crypto | forensics | other
    difficulty  TEXT NOT NULL DEFAULT '',   -- easy | medium | hard | insane
    solution    TEXT NOT NULL DEFAULT '',
    writeup     TEXT NOT NULL DEFAULT '',   -- contenuto Markdown completo
    flags       TEXT NOT NULL DEFAULT '',
    references  TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);

CREATE TABLE certifications (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL,
    issuer         TEXT NOT NULL DEFAULT '',
    date_earned    TEXT NOT NULL,
    expiry_date    TEXT DEFAULT '',
    credential_id  TEXT DEFAULT '',
    credential_url TEXT DEFAULT '',
    cover          TEXT DEFAULT '',
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL
);

CREATE TABLE tools (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL DEFAULT '',   -- reconnaissance | exploitation | forensics | reversing | other
    description TEXT NOT NULL DEFAULT '',
    repo        TEXT DEFAULT '',
    usage       TEXT NOT NULL DEFAULT '',
    tags        TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);

CREATE TABLE blog_posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    excerpt     TEXT NOT NULL DEFAULT '',
    content     TEXT NOT NULL DEFAULT '',   -- Markdown
    published   INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);

CREATE TABLE contacts (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL DEFAULT '',
    email     TEXT NOT NULL DEFAULT '',
    subject   TEXT NOT NULL DEFAULT '',
    message   TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);

CREATE TABLE settings ( key TEXT PRIMARY KEY, value TEXT );
CREATE VIRTUAL TABLE search_fts USING fts5(
    title UNINDEXED, kind UNINDEXED, ref UNINDEXED, body
);
```

---

## ⚡ Avvio Rapido

### Prerequisiti
- [Python 3.11+](https://www.python.org/downloads/)
- Un display per la modalità desktop (opzionale: si può usare nel browser)

### 1. Clona il repository

```bash
git clone https://github.com/sickkkalex/Cyber-Portfolio.git
cd Cyber-Portfolio
```

### 2. Prepara l'ambiente

```bash
python3 -m venv venv
venv/bin/pip install -r requirements.txt
```

### 3. Avvia l'app desktop

```bash
venv/bin/python desktop.py
```

Si apre la finestra nativa con il portfolio vuoto. Il server locale si avvia automaticamente su una porta libera.

### 4. Oppure: modalità browser (sviluppo)

```bash
venv/bin/python run.py --port 8770
```

Apri [http://127.0.0.1:8770](http://127.0.0.1:8770) nel browser.

> 🔁 **Prova subito:** genera contenuti di esempio (progetti, write-up, certificazioni) con
> ```bash
> venv/bin/python make_samples.py
> ```

### 5. Installazione come app desktop (Linux)

```bash
venv/bin/pip install pyinstaller
venv/bin/pyinstaller main.spec --noconfirm   # → dist/CyberPortfolio
./install.sh                                  # installa e crea la voce nel menu
```

Lo script `install.sh` si occupa di tutto:

| Cosa | Dove |
|---|---|
| Eseguibile | `~/.local/bin/cyber-portfolio` |
| Voce nel menu applicazioni | `~/.local/share/applications/cyber-portfolio.desktop` |
| Icona (SVG + PNG 256px) | `~/.local/share/icons/hicolor/` |
| Dati e database | `~/.local/share/CyberPortfolio` |

Dopo l'installazione **Cyber Portfolio** compare nel menu applicazioni (categoria *Sicurezza*) e si avvia con `cyber-portfolio` da terminale. Per rimuoverlo:

```bash
./install.sh --uninstall
```

> 💡 I dati dell'app compilata stanno in `~/.local/share/CyberPortfolio`, **fuori** dal pacchetto:
> re-installare o ricompilare non fa perdere nulla.

### 6. Test end-to-end

```bash
venv/bin/pip install playwright
venv/bin/python make_samples.py
./dev-server.sh                    # server in background
venv/bin/python tests/smoke.py     # portfolio, write-up e certificazioni
venv/bin/python tests/test_blog.py
venv/bin/python tests/test_tools.py
venv/bin/python tests/test_search.py
venv/bin/python tests/test_export.py
venv/bin/python tests/gallery.py   # screenshot di tutte le viste
```

---

## ⚙️ Variabili d'Ambiente

| Variabile | Default | Descrizione |
|---|---|---|
| `CYBER_PORTFOLIO_PORT` | `8770` | Porta del server locale |
| `CYBER_PORTFOLIO_DATA_DIR` | `./data` | Cartella di database, contenuti ed esportazioni |
| `CYBER_PORTFOLIO_FRONTEND_DIR` | `./frontend` | Percorso dell'interfaccia web |
| `CYBER_PORTFOLIO_SITE_URL` | `http://127.0.0.1:8770` | URL base del sito per link e esportazione |

```bash
# Esempio: dati su un disco esterno
CYBER_PORTFOLIO_DATA_DIR=/mnt/disco/CyberPortfolio venv/bin/python desktop.py
```

> **Nota:** tutto ciò che non viene escluso da `.gitignore` finisce nel repository.
> `data/`, `venv/`, `build/`, `dist/` e `samples/` sono già esclusi.

---

## 📡 API Reference

Tutte le risposte sono JSON. Il backend è locale e non espone dati di autenticazione.

### Progetti
| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/projects` | Lista i progetti (filtri `q`, `category`, `status`, `featured`, `sort`) |
| `POST` | `/api/projects` | Crea un progetto |
| `GET` | `/api/projects/:id` | Dettagli di un progetto |
| `PATCH` | `/api/projects/:id` | Modifica progetto |
| `DELETE` | `/api/projects/:id` | Elimina progetto |

### Write-up CTF
| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/writeups` | Lista i write-up (filtri `q`, `platform`, `category`, `difficulty`, `sort`) |
| `POST` | `/api/writeups` | Crea un write-up |
| `GET` | `/api/writeups/:id` | Dettagli di un write-up |
| `PATCH` | `/api/writeups/:id` | Modifica un write-up |
| `DELETE` | `/api/writeups/:id` | Elimina un write-up |

### Certificazioni
| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/certifications` | Lista le certificazioni |
| `POST` | `/api/certifications` | Crea una certificazione |
| `GET` | `/api/certifications/:id` | Dettagli di una certificazione |
| `PATCH` | `/api/certifications/:id` | Modifica una certificazione |
| `DELETE` | `/api/certifications/:id` | Elimina una certificazione |

### Strumenti
| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/tools` | Lista gli strumenti (filtri `q`, `category`, `tags`, `sort`) |
| `POST` | `/api/tools` | Crea uno strumento |
| `GET` | `/api/tools/:id` | Dettagli di uno strumento |
| `PATCH` | `/api/tools/:id` | Modifica uno strumento |
| `DELETE` | `/api/tools/:id` | Elimina uno strumento |

### Blog
| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/blog` | Lista articoli (filtri `q`, `published`, `sort`) |
| `POST` | `/api/blog` | Crea un articolo |
| `GET` | `/api/blog/:id` | Dettagli di un articolo |
| `PATCH` | `/api/blog/:id` | Modifica un articolo |
| `DELETE` | `/api/blog/:id` | Elimina un articolo |
| `GET` | `/api/blog/:slug` | Articolo per slug |

### Contatti e sistema
| Metodo | Endpoint | Descrizione |
|---|---|---|
| `POST` | `/api/contact` | Invia un messaggio di contatto |
| `GET` | `/api/search?q=` | Ricerca globale su tutti i contenuti |
| `GET` | `/api/stats` | Statistiche portfolio |
| `GET` | `/api/export?format=pdf\|markdown\|json` | Esporta l'intero portfolio |
| `GET` | `/api/settings` · `PUT` | Impostazioni (tema, tipografia, sito URL) |

---

## 🗺️ Roadmap

- [x] Gestione progetti sicurezza con categorie e stati
- [x] Archivio write-up CTF con piattaforma e difficoltà
- [x] Catalogo certificazioni con credenziali
- [x] Blog tecnico in Markdown
- [x] Ricerca full-text su tutti i contenuti (FTS5)
- [x] Tema chiaro/scuro e tipografia regolabile
- [x] Esportazione portfolio in PDF, Markdown e JSON
- [ ] Link pubblici condivisibili a sezioni singole
- [ ] Integrazione con GitHub API per progetti live
- [ ] Sistema di commenti su articoli blog
- [ ] Analytics visite (privacy-friendly, locale)
- [ ] Multi-lingua (ITA/ENG)
- [ ] Sincronizzazione opzionale via WebDAV/Git

---

## 🤝 Contribuire

I contributi sono i benvenuti! Per proporre una modifica:

1. Fai un **fork** del repository
2. Crea un branch: `git checkout -b feature/nuova-feature`
3. Committa le modifiche: `git commit -m 'feat: aggiungi nuova feature'`
4. Pusha il branch: `git push origin feature/nuova-feature`
5. Apri una **Pull Request**

---

## 📄 Licenza

Distribuito sotto licenza **MIT**. Vedi [`LICENSE`](LICENSE) per maggiori dettagli.

---

<div align="center">

Fatto con ❤️ da **Alessio**

*Cyber Portfolio — Sicurezza, progetti e conoscenza. Tutto sul tuo computer.*

</div>