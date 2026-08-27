# Backlog

## Tier 2 — Moons ✅ built (not yet deployed — see publishing checklist)

One `BodyView` per planet with notable moons: Jupiter's Galilean moons (Io, Europa, Ganymede,
Callisto), Saturn's major moons (Titan, Dione, Tethys, Mimas, Enceladus, Rhea), Uranus's five
largest (Oberon, Titania, Umbriel, Ariel, Miranda), Neptune's Triton, Mars's Phobos/Deimos,
Earth's Moon — 19 moons across 6 views, all real NASA/JPL photos. Setup/Learn/Leaderboard all
gained a collection picker (`CollectionPicker`, driven by the engine's `COLLECTIONS` list) to
choose Planets vs. a given planet's moons; Mastery shows every collection as its own section
instead of needing a picker; Daily Challenge now draws from every body, not just planets.

## Tier 3 — Surface features

One view per body with named surface features worth quizzing:

- **The Moon**: major maria and craters, and specifically **the six Apollo landing sites — 11,
  12, 14, 15, 16, 17** (don't drop this, it was explicitly requested when this app was planned).
- **Mars**: Olympus Mons, Valles Marineris, Gale Crater, and similar named regions.

USGS Astrogeology (astrogeology.usgs.gov) and the Gazetteer of Planetary Nomenclature
(planetarynames.wr.usgs.gov) are the source for real labeled/unlabeled surface maps and exact
coordinates, including the Apollo landing sites.

## Publishing checklist

- [x] **Firebase console setup.** Project "helioworldly" created, Web app registered, real
  config wired into `packages/client/src/network/firebase.ts`. Firestore is provisioned and
  reachable (verified 2026-08-26 via a REST read — `leaderboard/` came back 200 with an empty,
  queryable collection). Double check the exact contents of `/firestore.rules` were pasted into
  the console's Rules tab and Published — that's the one step I can't verify from here.
- [x] **Connect the repo in Netlify.** Live at https://helioworldly.netlify.app/.
- [x] **Add a Helioworldly card to the game hub.** Live on dansgamehub.netlify.app, pointing at
  the URL above.
- [x] Planet hit-region coordinates (`packages/engine/src/planets.ts`) — measured against NASA's
  own solar-system illustration (PIA11800) via labeled coordinate-grid crops, confirmed with an
  overlay render.
- [ ] **Push Tier 2 (Moons) live.** Built and verified locally (43→71 engine tests, full
  Playwright click-through of every new collection) but not yet pushed — the user is rationing
  Netlify deploys and wants to push deliberately rather than after every change. Ready whenever
  they say go.

## Smaller polish (not blocking)

- Dwarf planets (Pluto, Ceres, etc.) as an optional extra set within the Planets tier.
- A "practice weak spots only" quiz variant that filters to struggling/shaky bodies instead of
  quizzing everything.
