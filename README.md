# FLARENEXUS

**Fire Lab + Research Nexus for Microgravity Fire Safety**
NASA Space Apps Challenge 2026 · Team Cosmic Nexus

An evidence-first research platform for fire safety in reduced-gravity and enclosed
microgravity environments. Built around a demonstration dataset, Flame Lab, Mission Lab,
Firewise AI, Insights, and side-by-side record comparison.

> **Prototype notice.** Every experiment record, metric, risk score, flame rendering, chart and
> assistant answer in this application is synthetic demonstration data. Nothing here is a
> validated scientific result, and no record is a representation of a specific real NASA, TM or
> NTRS document. Evidence levels are shown on every record so the distinction is never hidden.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

Requires Node.js 20.9+ (developed on Node 22).

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Dashboard: headline metrics, interactive flame, risk panel, recent insights, coverage |
| `/explore` | Searchable, filterable, sortable index of all 26 experiment records |
| `/experiments/[id]` | Full record: conditions, observed behaviour, sources, timeline, mission relevance |
| `/compare` | Side-by-side comparison of up to three experiments, with a difference summary |
| `/flame-lab` | Deterministic flame reconstruction with adjustable conditions and presets |
| `/mission-lab` | Research relevance of the dataset against Earth, ISS, Moon and Mars |
| `/firewise` | Evidence-first assistant over the dataset, with citations and confidence grades |
| `/insights` | Cross-experiment patterns, findings, conflicts, research gaps and charts |
| `/saved` | Locally stored bookmarks for experiments, insights and answers |
| `/settings` | Motion, display and data preferences |

`/experiments` redirects to `/explore`.

## Architecture

```
app/          Thin routes: fetch data, set metadata, render a feature component
components/   UI by feature (dashboard, explore, compare, flame-lab, mission-lab,
              firewise, insights, saved, settings, shell, space, three, shared,
              charts, flame, visual, mission)
lib/api/      The only layer that reads data/ — components never import data directly
lib/          Calculations, flame geometry, formatters, storage, navigation, contexts
data/         Synthetic records: experiments, sources, timelines, missions, insights, AI
```

Four React contexts carry state: settings, saved items, comparison selection and Firewise
conversations. Persistence uses `useSyncExternalStore` over a namespaced localStorage store
(`flarenexus:*`), so no effect mirrors external state into component state.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Recharts · Three.js + React Three Fiber ·
lucide-react · JavaScript

## Theming

One space-dark profile, with no light alternative. Semantic `--fx-*` custom properties are
declared in `app/globals.css` and components reference tokens only — there are no call-site
`dark:` variants. The operating system's `prefers-reduced-motion` setting is honoured regardless
of the in-app preference.

Two notes for anyone extending the token layer. `--radius-panel` and `--radius-hud` must be
**literal** values inside `@theme inline`, not `var()` references to `:root` — a self-referential
token resolves to nothing at build time. And when a style prop carries a unitless number such as
`opacity`, pass it pre-formatted as a string: the server serialises `0.16`, the browser parses it
back as `"0.16"`, and a number prop will never equal a string during hydration.

## The space environment

`components/space/` paints one atmosphere behind the whole application, mounted once in `AppShell`
rather than per page. `components/space/depth.js` is the depth contract and the density presets:

| Depth | Plane |
| --- | --- |
| `void` | the canvas — `body` background |
| `deep` | gradient, nebula washes, destination horizon bloom, edge vignette |
| `far` | distant starfield |
| `lattice` | slow-rotating orbital arcs |
| `near` | near starfield and drifting motes |
| `subject` | the WebGL mission object |
| `data` | canvas-anchored readouts |
| `ui` | instrument panels |
| `overlay` | drawers, popovers, focus |

Each route picks a density preset and a destination in `AppShell`'s `ENVIRONMENT` table, so
decoration is scaled in one place and a dense data route never competes with the environment for
attention.

**The environment is a background plane, not an overlay.** It is a positioned element with a
positive `z-index`, so it paints above anything in normal flow — the rail and the main column
therefore declare `DEPTH.ui` explicitly. Omit that and the veil covers the entire application while
the build still succeeds and the DOM still hydrates.

## The 3D engine

`components/three/` holds one guarded canvas host. `EngineCanvas` answers four questions in order:
has availability resolved, is there a reason not to run, is it on screen, and how many pixels may
be spent. It falls back for Save-Data, missing WebGL and context loss, and renders a *single static
frame* under reduced motion — a preference should change motion, never remove information.

| Decision | Why |
| --- | --- |
| `dynamic(..., { ssr: false })` | keeps three.js out of the server bundle and stops `window` being touched at build time |
| DPR clamped to 1.75 | above that a full-bleed shader is fill-rate for no visible gain |
| Off-screen and hidden paused separately | an off-screen scene is common on a scroll-heavy layout; a backgrounded tab still reports as on-screen on mobile |
| No textures, models, shadows or postprocessing | the flame is one quad and one fragment shader |
| Chamber is a wireframe, not transmissive | a real transmission pass needs a render target and would cost more than the flame |
| Readouts are DOM, never drawn in the canvas | canvas text is unselectable, unannounced and blurry at any other DPR |

`getFlameProfile(params)` in `lib/flameGeometry.js` is the single source of the flame's shape. The
WebGL shader and the SVG fallback both consume it and evaluate the same envelope law, so the two
cannot disagree about what a set of conditions looks like. `FlameStage` keeps `FlameVisual` mounted
permanently behind the canvas — it is a fallback, not a loading state.

## Performance

The environment is CSS: one paint per layer, no `requestAnimationFrame`, transform-only animation.
It is not a substitute for WebGL behind a blurred panel, and it is the reason a page of static
points costs nothing. WebGL is spent only where the subject *is* the environment.

## Verification

`npm run lint` and `npm run build` both pass, but neither will catch a shader that fails to
compile, a scene that never mounts, or a stacking context that hides the interface. Those were all
real bugs in this codebase during development and all three were found by rendering routes headless
and inspecting pixels:

```bash
npm run dev
# then, in another shell — software WebGL, so the shader path is genuinely exercised
msedge --headless=new --use-gl=angle --use-angle=swiftshader \
  --enable-unsafe-swiftshader --enable-logging=stderr \
  --screenshot=out.png http://localhost:3000/flame-lab
```

Console output is the signal for hydration mismatches, GLSL compile failures and context loss.