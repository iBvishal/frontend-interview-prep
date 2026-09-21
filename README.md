# frontend-interview-prep

Reusable skeletons for frontend machine-coding interviews. Everything is **Vite + vanilla TypeScript, no framework**, so the same patterns work in any interview sandbox (CodeSandbox, StackBlitz, a bare Vite project).

The goal of this repo is to hand an AI assistant (Claude, etc.) full context upfront so that during an interview it already knows the conventions, folder layout, and building blocks used here. See [`CLAUDE.md`](./CLAUDE.md) for the AI-facing guide.

## Projects

| # | Folder | What it is | Key concepts |
|---|--------|------------|--------------|
| 1 | `1_comments-vanilla-ts` | Nested comments widget (add, reply, edit, delete, vote) | Normalised state (`byId` + `rootIds`), recursive render, event delegation, localStorage persistence |
| 2 | `2_todo-list-app-vanilla-ts` | Kanban / todo board, cards move between columns | Normalised board state, `columnOrder`, typed API client stub, localStorage |
| 3 | `3_debouncing` | Debounced search input (JS and TS versions) | Closure-based `debounce`, `input` listener cleanup, fetch to a public API |
| 4 | `4_potential_test_questions/1_sip_ladder_diagram` | Interactive SIP sequence diagram | SVG rendering, arrows with `marker-end`, detail drawer, filtering |
| 4 | `4_potential_test_questions/2_rtp_stream_graph` | RTP packet-loss / jitter time-series graph | Canvas or SVG line chart, crosshair tooltip, threshold shading, summary badges |
| 4 | `4_potential_test_questions/3_sms_compliance_segment_calculator` | SMS segment and encoding calculator | GSM-7 vs UCS-2 detection, character highlighting, compliance checklist, phone preview |
| 4 | `4_potential_test_questions/4_call_session_inspector` | Live call session inspector | Event timeline, filtering and search, simulated real-time replay, auto-scroll |
| 4 | `4_potential_test_questions/5_intl_number_provisioning` | Phone number provisioning wizard | Multi-step form, country-driven dynamic fields, validation, cart |

Each project under `4_potential_test_questions/` has its own `README.md` with the full problem statement.

## Running any project

```bash
cd <project-folder>
npm install
npm run dev
```

All projects share the same `package.json` scripts: `dev`, `build` (`tsc && vite build`), `preview`.

## Standard project layout

```
<project>/
  index.html          # <div id="app"></div> + <script type="module" src="/src/main.ts">
  package.json        # vite + typescript, occasionally lodash
  tsconfig.json
  public/             # favicon.svg, icons.svg (optional)
  src/
    main.ts           # state, handlers, event delegation, saveAndRender()
    types.ts          # interfaces for state and entities
    mockData.ts       # initial state / fixtures (mock-data.ts in newer projects)
    render*.ts        # pure functions returning HTML strings
    localStorage.ts   # loadState() / saveState()
    api.ts            # typed fetch wrapper (where relevant)
    style.css
```
