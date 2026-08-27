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

Jupiter's, Saturn's, and Uranus's moon views use official NASA/JPL "family portrait" montages
directly as the shipped asset (`public/assets/moons-{jupiter,saturn,uranus}.jpg`) — no local
source copy needed since nothing was cropped out of them:
- **Jupiter** — PIA09352 "Jupiter's Moons: Family Portrait" (New Horizons/LORRI). Credit:
  NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute.
- **Saturn** — PIA01482 "Saturn System Montage" (Voyager 1 data). Credit: NASA/JPL.
- **Uranus** — PIA01361 "Uranus - Montage of Uranus' Five Largest Satellites" (Voyager 2).
  Credit: NASA/JPL.

Neptune, Mars, and Earth's views needed compositing (no ready-made montage), so their source
photos are kept here:
- **`triton-source.jpg`** — PIA00317, global color mosaic of Triton (Voyager 2). Credit:
  NASA/JPL/USGS. Resized down for `public/assets/moons-neptune.jpg`.
- **`phobos-source.jpg`** — PIA10368 (Mars Reconnaissance Orbiter/HiRISE). Credit: NASA/JPL-
  Caltech/University of Arizona.
- **`deimos-source.jpg`** — PIA11826 (HiRISE); only the left of its two side-by-side views is
  used. Credit: NASA/JPL-Caltech/University of Arizona. Phobos + Deimos are composited onto a
  plain black canvas for `public/assets/moons-mars.jpg` — no masking needed since Tier 1's
  cropping problems only ever came from touching/overlapping bodies, and these two don't touch.
- **`moon-source.jpg`** — NASA image library asset `GSFC_20171208_Archive_e000868`, "Full Moon"
  (Goddard Space Flight Center). Resized down for `public/assets/moons-earth.jpg`.
