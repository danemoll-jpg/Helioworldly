# Source images (not published)

This folder is outside `public/`, so Vite/Netlify never ships these — kept only for
reproducibility if `public/assets/solar-system.jpg` ever needs regenerating (a resize, a
recrop, etc.).

- **`solar-system-illustration-source.jpg`** — NASA/JPL's official solar-system illustration
  (PIA11800, https://science.nasa.gov/photojournal/our-solar-system-features-eight-planets/).
  Credit: NASA/JPL. Public domain (US government work). NASA's own caption: "intentionally
  fanciful, as the planets are depicted far closer together than they really are" — the Sun and
  planets are real mission imagery, composited by NASA/JPL onto an illustrated orbit-grid
  background, not to true relative scale or spacing. `public/assets/solar-system.jpg` is this
  same image, just resized down (5775px → 3600px wide) for a smaller download.

v1 of this app instead composited its own heliocentric image from individually-cropped photos
(NASA/JPL's "Solar System Montage", PIA03153, + a Solar Dynamics Observatory Sun photo,
PIA26681) — replaced after feedback that the crops looked visibly rough. Superseded, and those
source files were removed from this folder; PIA03153/PIA26681 credits are noted here only for
history, and can be re-sourced from NASA's site if that approach is ever revisited.

## Tier 2 (Moons) sources

v2 of this tier composited every moon view by hand instead of using pre-made NASA "family
portrait" montages: each moon is its own individual full-disk NASA/JPL photo, placed onto a
starfield with hand-drawn tilted orbit rings around a planet. Rationale: the old montage-based
version (and before that, v1's individually-cropped Tier 1 planets image) both drew feedback that
crops looked visibly rough — this approach keeps every source photo whole and does the
compositing/masking itself, so there's no cropped-rectangle artifact to hide.

v2's planet was still a crop out of `public/assets/solar-system.jpg` (Tier 1's source
illustration) though, and that illustration draws a decorative orbit-grid *through* some
planets' disc — faint but visible on Uranus especially, no matter how the crop mask was tuned,
since it's baked into the source pixels rather than being a cropping mistake. v3 (current)
replaced that with real NASA/JPL full-disk planet photos on plain black — see `planets-src/`
below — cut out the exact same way the moons are. See `build_moons.py` in this folder, which
regenerates all six `public/assets/moons-*.jpg` from the raw photos in `moons-src/` and
`planets-src/`.

### Planets (`planets-src/`)

All real NASA/JPL(-Caltech) mission imagery, full disk on black, from NASA's photojournal
(science.nasa.gov/photojournal):

- **`jupiter.jpg`** — PIA02873, "High Resolution Globe of Jupiter" (Cassini, true-color
  simulated view). Credit: NASA/JPL/Space Science Institute.
- **`saturn.jpg`** — PIA05389, "Saturn in Color" (Cassini narrow-angle camera, natural color,
  March 27, 2004). Credit: NASA/JPL/Space Science Institute.
- **`uranus_dual.jpg`** — PIA00032, "Uranus in True and False Color" (Voyager 2). This ships as a
  true-color/false-color pair side by side; only the left (true-color) half is used, via
  `precrop` in `build_moons.py`. Credit: NASA/JPL.
- **`neptune.jpg`** — PIA01492, "Neptune Full Disk View" (Voyager 2, last whole-planet images).
  Credit: NASA/JPL.
- **`mars.jpg`** — PIA00407, "Global Color Views of Mars" (~1,000 Viking Orbiter images, global
  color mosaic). Credit: NASA/JPL/USGS.
- **`earth.jpg`** — PIA18033 (VIIRS/Suomi NPP Blue Marble, digitally projected onto a globe).
  Credit: NASA/NOAA.

All 19 moon photos in `moons-src/` are real NASA/JPL(-Caltech) mission imagery pulled from NASA's
photojournal (science.nasa.gov/photojournal, photojournal.jpl.nasa.gov). Exact PIA catalog
numbers confirmed this pass: Europa `europa-try2.jpg` = PIA01295, Titania `titania-full.jpg` =
PIA01979, Ariel `ariel-full.jpg` = PIA00037, Miranda `miranda-full.jpg` = PIA01490, Umbriel
`umbriel-full.jpg` = PIA00040, Oberon `oberon1.jpg` = PIA00034, Titan `titan-panels.jpg` =
PIA06227 (only the left/natural-color panel is used, via `precrop` in `build_moons.py`). The
remaining files (Io, Ganymede, Callisto, Mimas, Enceladus, Tethys, Dione, Rhea, Triton, Phobos,
Deimos, the Moon) were sourced the same way in an earlier part of this session whose exact
fetch URLs weren't preserved — re-verify their PIA numbers on photojournal before reusing them
outside this game.

`triton-source.jpg`, `phobos-source.jpg`, `deimos-source.jpg`, and `moon-source.jpg` are leftover
from the older montage-composite version described above (Triton/Phobos/Deimos/Moon on a plain
canvas) and are no longer read by `build_moons.py`; kept only for history alongside their old
credits (PIA00317 Triton/Voyager 2/NASA-JPL-USGS; PIA10368 Phobos/MRO-HiRISE/NASA-JPL-Caltech-
University of Arizona; PIA11826 Deimos, same credit; `GSFC_20171208_Archive_e000868` "Full Moon"
Goddard Space Flight Center).
