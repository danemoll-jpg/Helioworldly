# Helioworldly

A solar-system companion to Worldly/Outworldly/Innerworldly. **Tier 1 (Planets) is built** — pan
and zoom NASA/JPL's solar-system montage, find/name/pick the planet you're asked about, no
timer, no pressure. Moons and surface features (see [BACKLOG.md](./BACKLOG.md)) are next.

## The idea

A solar-system companion to [Outworldly](https://github.com/danemoll-jpg/outworldly) — but a
**separate app**, not an expansion of it. Find planets, find their moons, and (eventually) find
named surface features on specific bodies (Moon craters/maria, Mars regions, and specifically
the **Apollo landing sites** on the Moon).

## Why a separate app, not an Outworldly expansion

Outworldly's whole architecture is built around one specific mechanic: a single static star map
(real star positions, one big SVG), pan and zoom, find a fixed constellation pattern on it. That
works because constellations don't move relative to each other — they're permanent fixtures on
the celestial sphere.

Planets and moons break that assumption:

- **Planets move.** There's no single fixed spot to put "Jupiter" on a star map the way there is
  for "Orion" — planets wander relative to the background stars, which is literally what the
  word means.
- **Moons aren't sky-map content at all.** "Find Titan" only makes sense as a close-up
  diagram/photo of Saturn with its moons labeled around it — not as a point in the night sky.
- **Surface features** (Mars regions, lunar maria/craters, Apollo landing sites) are a third
  visual paradigm again — a planetary surface map, not a sky map.

Bolting three unrelated diagram types onto an app whose entire architecture is "one big star map"
would blur a currently clean identity and complicate a codebase that's carefully tuned for that
one big SVG.

## Why it fits Innerworldly's architecture instead

[Innerworldly](https://github.com/danemoll-jpg/innerworldly)'s `BodySystem` + `BodyView` split —
a system (e.g. "organs") spanning multiple photos, each with its own named hit-testable regions —
is exactly the shape this needs, just for celestial bodies instead of anatomy:

- **Planets system** — one diagram/photo, all 8 planets (maybe dwarf planets too) as regions.
- **Moons system** — one view *per planet*, each with that planet's major moons as regions
  (Jupiter's Galilean moons, Saturn's major moons, Mars's Phobos/Deimos, Earth's Moon). Same
  "one photo, several named sub-regions" pattern already proven three times over in Innerworldly
  (organs, brain, muscles).
- **Surface features system** (the "eventually" tier) — one view per body that has named surface
  features worth quizzing: the Moon (maria, major craters, **the six Apollo landing sites** —
  11, 12, 14, 15, 16, 17 — specifically requested, don't drop this), Mars (Olympus Mons, Valles
  Marineris, Gale Crater, and similar named regions). Structurally the same as Worldly's own
  country-map pattern (a flat map, named clickable regions) — just for another body's surface.

Building order should follow this same tiered growth Innerworldly already used successfully:
Planets first (smallest, most self-contained), then Moons, then Surface features last (the most
content-heavy tier, and the one with the most "which features are worth including" judgment
calls).

## What gets reused, not rebuilt

Almost everything underneath is expected to be a straight port from the existing three apps, not
new engineering:

- `panZoom.ts` (pan/zoom/pinch over an SVG) — generic, no changes needed.
- `matching.ts` (typo-tolerant name matching for typeIt mode).
- The weak-spots/mastery engine (`stats.ts` / `weighting.ts`) and its Mastery-map screen.
- Learn mode (browse everything, search, jump to one).
- Daily Challenge (`dailyChallenge.ts` + its screen) — one shared deterministic pick a day.
- The Firebase global-leaderboard wiring.
- The whole npm-workspaces scaffolding (framework-free TS engine package + Vite/React client),
  same conventions as Worldly/Outworldly/Innerworldly.

A new app here means a fresh, coherent front door for a genuinely different visual mechanic
(many diagrams-with-regions, like Innerworldly), not starting the engineering over.

## Image sourcing — the good news

Unlike Innerworldly's anatomy content (no free "labeled human body" dataset exists, which forced
AI image generation and all the moderation friction that came with it — see Innerworldly's own
BACKLOG.md), solar-system imagery has a genuinely great free source: **NASA**, and **USGS** for
surface maps.

- NASA's own photos are public domain in the US (17 U.S.C. §105 — federal government works
  aren't copyrightable). No AI generation needed, no moderation risk — real photos of the actual
  planets and moons.
- Caveat: NASA's library also hosts images *from* non-NASA sources (international partners,
  contractors) that can carry their own terms — usually still permissive (ESA imagery is
  typically CC BY-SA, free with attribution) but worth checking the credit line on whichever
  specific image gets picked, rather than assuming blanket public domain for everything on the
  site.

Concrete places to start looking when it's time to build:

- **NASA Image and Video Library** (images.nasa.gov) — NASA has published actual "family
  portrait" images of all 8 planets side by side, to scale by size. A ready-made base photo for
  the Planets system.
- **JPL Photojournal** (photojournal.jpl.nasa.gov) — montage photos of a planet's major moons
  together (Voyager/Cassini/Galileo), organized by mission and target body. The source for the
  Moons system's per-planet photos.
- **USGS Astrogeology** (astrogeology.usgs.gov) and the **Gazetteer of Planetary Nomenclature**
  (planetarynames.wr.usgs.gov) — the official source for named surface features on the Moon,
  Mars, and other bodies, including real labeled/unlabeled surface maps. The source for the
  Surface features system — including the Apollo landing site coordinates.

Even with real photos instead of AI-generated ones, the actual build process per image stays the
same as every system built so far: pick/crop a specific image, measure hit regions from it,
verify by rendering a semi-transparent overlay on the real photo, wire it in. NASA/USGS just
remove the image-*creation* step and its moderation risk entirely — the measuring/wiring work is
unchanged.

## Naming

"Helioworldly" (helio- = sun) was the working name that stuck — fits the "-worldly" family,
reads as distinct from Outworldly's night-sky-observing framing (this app is about the solar
system specifically, not deep-sky/celestial-sphere content).

## Architecture

npm-workspaces monorepo, same shape as Worldly/Outworldly/Innerworldly:

- **`packages/engine`** — pure TypeScript, no UI/rendering dependencies. Planet data
  (`planets.ts`), hit-region geometry (`geometry.ts`), lenient answer matching (`matching.ts`),
  quiz session tracking (`session.ts`), mastery/weak-spot tracking (`stats.ts`/`weighting.ts`),
  and the Daily Challenge picker (`dailyChallenge.ts`).
- **`packages/client`** — React 18 + Vite. `CelestialDiagram` (pan/zoom SVG surface rendering
  the montage photo plus its hit-region overlays) plus the screens that drive a quiz session
  (Home → Setup → Quiz → Summary), Learn, Mastery, and Daily Challenge. The photo lives at
  `packages/client/public/assets/planets-montage.jpg`.

Three quiz modes: **Find it** (named a planet, tap it on the diagram), **Type its name** (a
planet is highlighted, type its name — typo-tolerant), and **Multiple choice** (highlighted
planet, pick from 4 name buttons).

## Development

```sh
npm install
npm run dev    # builds the engine once, then starts the client dev server
npm test       # engine unit tests (vitest)
npm run build  # production build — this is what Netlify runs
```

## Deployment / publishing status

See [BACKLOG.md](./BACKLOG.md)'s publishing checklist — Netlify config (`netlify.toml`) and
Firestore rules (`firestore.rules`) are already in the repo, but the real Firebase project and
Netlify site connection are one-time manual steps still to do before this goes live. Until then
the app works fully offline (localStorage); only the global leaderboard panel stays in a
"not live yet" state.

## Status / next step

Tier 1 (Planets) is built. Next: Tier 2 (Moons), then Tier 3 (Surface features, including the
Apollo landing sites) — tracked in [BACKLOG.md](./BACKLOG.md) so nothing gets lost.
