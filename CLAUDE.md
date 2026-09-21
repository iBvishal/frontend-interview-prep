# CLAUDE.md

Context for AI assistants working in this repo. Read this before touching any project.

## Purpose

This is an interview-prep monorepo. Each top-level folder is an independent Vite + vanilla TypeScript app built as a **reusable skeleton for frontend machine-coding rounds**. During an interview the owner may point an AI at this repo and ask it to scaffold a new problem "in the same style". Consistency with the existing patterns matters more than cleverness.

## Hard constraints

- **Vanilla TypeScript only.** No React, Vue, Svelte, or UI libraries. `lodash` is the only runtime dependency that appears.
- **Vite** is the dev server and bundler. Scripts are always `dev`, `build` (`tsc && vite build`), `preview`.
- Each project is self-contained with its own `package.json`, `node_modules`, and `tsconfig.json`. There is no root package or workspace. Run commands from inside the project folder.
- `node_modules/` and `dist/` are gitignored at the root. Never commit them.

## Architecture pattern (follow this when scaffolding new projects)

1. **State lives in `main.ts`** as a single mutable object typed from `types.ts`. Collections are **normalised**: a `byId: Record<string, T>` map plus ordering arrays (`rootIds`, `columnOrder`, `cards: string[]`).
2. **Rendering is string-based.** `render*.ts` files export pure functions that take state and return an HTML string. `main.ts` does `app.innerHTML = render(state)`.
3. **Event handling uses delegation.** One `click` (or `input`) listener on `#app`; branch on `target.classList.contains(...)` or `target.closest(...)` and read `data-*` attributes (`dataset.cardId`, `dataset.columnId`).
4. **Persistence** via `localStorage.ts` exposing `loadState()` and `saveState(state)`. Initial state comes from `mockData.ts` when storage is empty: `const state = loadState() || initialState`.
5. **Mutate then `saveAndRender()`.** Handlers mutate `state` directly, then a single `saveAndRender()` persists and re-renders the whole tree.
6. **IDs** are generated as `'<prefix>_' + Date.now()`.
7. **API layer** (`api.ts`) is a small typed `request<T>(endpoint, options)` wrapper around `fetch` with `response.ok` checks, exposing an `api` object of methods. Real endpoints are placeholders.
8. **Utilities** like `debounce` are hand-written closures (see `3_debouncing/vanilla-ts/src/debounced-search.ts`), not imported.

## Styling

- Plain CSS in `src/style.css`, imported from `main.ts`.
- Newer projects (`4_potential_test_questions/*`) use a dark developer-tool aesthetic with Inter and JetBrains Mono from Google Fonts, linked in `index.html`.
- SVG is preferred for diagrams and arrows (`marker-end` for arrowheads); Canvas for dense time-series.

## Naming

- Folders are numbered for ordering: `N_kebab-case-name`.
- Older projects use `mockData.ts` / `renderX.ts` (camelCase); newer ones use `mock-data.ts` (kebab-case). Match whichever the project you are editing uses. For new projects prefer kebab-case.
- Import extensions are inconsistent (`./types.js` vs `./types.ts`). Vite accepts both; do not churn existing files over this.

## When asked to scaffold a new interview problem

1. Create `N_problem-name/` at the appropriate level, copying `index.html`, `package.json`, `tsconfig.json`, `.gitignore` from `2_todo-list-app-vanilla-ts`.
2. Add a `README.md` with Background, Task, Functional Requirements, and Mock Data Shape (see any folder in `4_potential_test_questions/`).
3. Create `src/types.ts`, `src/mock-data.ts`, `src/main.ts`, `src/style.css`, plus `render-*.ts` and `local-storage.ts` as needed.
4. Keep `main.ts` under ~200 lines; split rendering out.
5. Do not add dependencies without asking.

## Running

```bash
cd <project>
npm install
npm run dev
```
