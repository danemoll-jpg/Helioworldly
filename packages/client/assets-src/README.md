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
