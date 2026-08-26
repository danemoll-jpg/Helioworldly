# Backlog

## Tier 2 — Moons

One `BodyView` per planet with major moons, each a montage photo with the moons as named
regions (same "one photo, several named sub-regions" pattern Tier 1 used for the planets):
Jupiter's Galilean moons (Io, Europa, Ganymede, Callisto), Saturn's major moons (Titan,
Enceladus, Mimas, Rhea, Iapetus, ...), Mars's Phobos/Deimos, Earth's Moon. JPL Photojournal
(photojournal.jpl.nasa.gov) is the source for per-planet moon montages — see the README's
"Image sourcing" section.

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
- [ ] **Connect the repo in Netlify.** `netlify.toml` is already set up (root-level build,
  publishes `packages/client/dist`) — just needs the repo connected to a Netlify site.
- [ ] **Add a Helioworldly card to the game hub** (dansgamehub.netlify.app / its repo) once
  there's a real deployed URL to link to. Needs access to that repo — it isn't public, so point
  me at it (local path or an invite) when this is ready.
- [x] Planet hit-region coordinates (`packages/engine/src/planets.ts`) were measured via an
  automated windowed color/bounding-box pass over the downloaded image and confirmed by
  rendering a semi-transparent overlay on the real photo. Good enough for v1; still worth a
  final once-over in an actual browser at various zoom levels if any region feels off in play.

## Smaller polish (not blocking)

- Dwarf planets (Pluto, Ceres, etc.) as an optional extra set within the Planets tier.
- A "practice weak spots only" quiz variant that filters to struggling/shaky bodies instead of
  quizzing everything.
