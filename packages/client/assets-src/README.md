# Source images (not published)

This folder is outside `public/`, so Vite/Netlify never ships these — they're kept for
reproducibility if the heliocentric composite (`public/assets/planets-heliocentric.jpg`) ever
needs regenerating (a different layout, a Tier 2 moons montage cut from the same source, etc.).

- **`planets-montage-source.jpg`** — NASA/JPL's "Solar System Montage" (PIA03153,
  https://photojournal.jpl.nasa.gov/catalog/PIA03153). Credit: NASA/JPL. Public domain (US
  government work). Each planet's real-photo cutout in the composite was cropped from this.
- **`sun-source.jpg`** — NASA/GSFC Solar Dynamics Observatory, AIA 171Å, 2025-09-10 (PIA26681,
  https://www.jpl.nasa.gov/images/pia26681-image-of-sun-from-nasas-solar-dynamics-observatory/).
  Credit: NASA/GSFC/Solar Dynamics Observatory. Public domain (US government work).

The composite itself (orbit rings, starfield, Saturn's ring graphic, planet placement) was
generated with a one-time Python/Pillow script — not committed, same convention as the
auto-generated engine data files' own codegen scripts elsewhere in this series.
