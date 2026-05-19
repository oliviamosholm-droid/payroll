# Payroll prototypes

Clickable UX prototypes for [e-conomic Løn](https://www.e-conomic.dk/), built to test concrete design hypotheses with real users. Built with React, TypeScript, Vite, and the [Taco design system](https://github.com/e-conomic/taco).

## Prototypes

The landing page lists three prototypes across two projects:

**Onboarding** — how new users get employees into e-conomic Løn without typing each one manually.

- **Onboarding · v1** — drag-and-drop payslips/spreadsheets to auto-generate employee drafts. Editing happens on a full page; AI-extracted fields are highlighted in yellow.
- **Onboarding · v2** — same upload flow as v1, but editing happens in a modal and AI-extracted fields are marked with a ✨ icon inside the input.

**Scheduled changes** — how users schedule future changes to salary, department, pay period, etc., per employee.

- **Planlagte ændringer · v1** — every time-controllable field gets a "Schedule change" affordance that opens an inline panel for new value + effective date. Scheduled changes show up as chips under the field.

## Running locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints.

## Scripts

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build into `docs/` (used by GitHub Pages)
- `npm run build:strict` — runs `tsc -b` before the build for strict type checking
- `npm run lint` — ESLint
- `npm run preview` — preview the production build locally

## Deployment

GitHub Pages serves from the `docs/` folder on `main`. To publish a new version:

```bash
npm run build
git add docs
git commit -m "Build"
git push
```

## Project structure

```
src/
  pages/         Top-level routed pages (Landing, EmployeeList, EmployeeDetail, …)
  features/
    employee-onboarding/   Drag-and-drop, import dialog, employee edit dialogs (v1/v2/schedule)
  layouts/       AppShell with Taco Header + sidebar Navigation2
  data/          Danish copy, mock employees, prototype metadata
  store/         Lightweight in-memory employee store (resettable from the sidebar)
  paths.ts       Per-variant route helpers and the useVariantPaths hook
```

Each prototype variant is mounted at its own URL prefix (`/onboarding-v1`, `/onboarding-v2`, `/scheduled-changes-v1`) so the same pages can render under different editing modes via the `editMode` prop on `EmployeeListPage`.
