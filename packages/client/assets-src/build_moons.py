"""Regenerates all six Tier 2 (Moons) composite images (public/assets/moons-*.jpg) from the raw
source photos in moons-src/ and planets-src/.

Each output image is built by hand, not stitched from a pre-made NASA montage: the planet is a
real NASA/JPL full-disk photo (see planets-src/README.md for exact sources) cut out the same way
the moons are, each moon is a real NASA/JPL full-disk photo too (see moons-src/README.md), and
both are placed onto a starfield with hand-drawn tilted orbit rings.

v1 of this file cropped the planet from public/assets/solar-system.jpg (Tier 1's source
illustration) instead of using a real photo — abandoned because that illustration draws a
decorative orbit-grid *through* some planets' disc (Uranus especially), and no amount of mask
tuning fully hid it without also risking eating into real surface detail. Real photos on a plain
black background sidestep the problem entirely: nothing to mask out except space.

Run from anywhere with: python3 build_moons.py  (needs numpy, Pillow, scipy)

After running, packages/engine/src/moons.ts' cx/cy/rx/ry and *_VIEWBOX constants must match the
printed placement JSON if the canvas sizes or moon positions below ever change.
"""
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
import math, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'moons-src')
PLANETS_SRC = os.path.join(HERE, 'planets-src')
ASSETS = os.path.normpath(os.path.join(HERE, '..', 'public', 'assets'))

# ---------------------------------------------------------------------------
# Planet cutouts — real NASA/JPL full-disk photos, auto-detected and given a soft round/elliptical
# alpha edge, same technique as the moon photos below. `precrop` trims Uranus's source down to
# just its true-color panel (that image ships as a true-color/false-color pair side by side).
_PLANET_SOURCES = {
    'jupiter': ('jupiter.jpg', None),
    'saturn':  ('saturn.jpg', None),
    'uranus':  ('uranus_dual.jpg', (0, 0, 1000, 1000)),  # left half only (true color)
    'neptune': ('neptune.jpg', None),
    'mars':    ('mars.jpg', None),
    'earth':   ('earth.jpg', None),
}


def detect_and_cutout_ellipse(filename, precrop=None, threshold=15, pad=1.12, inner=0.94):
    img = Image.open(f'{PLANETS_SRC}/{filename}').convert('RGB')
    if precrop:
        img = img.crop(precrop)
    arr = np.array(img).astype(int)
    mask = arr.max(axis=2) > threshold
    labeled, n = ndimage.label(mask, structure=np.ones((3, 3), dtype=int))
    counts = np.bincount(labeled.ravel())
    counts[0] = 0
    best_label = counts.argmax()
    ys, xs = np.where(labeled == best_label)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    rx, ry = (x1 - x0) / 2 * pad, (y1 - y0) / 2 * pad
    box = (int(cx - rx), int(cy - ry), int(cx + rx), int(cy + ry))
    crop = img.crop(box)
    w, h = crop.size
    yy, xx = np.mgrid[0:h, 0:w]
    ex, ey = w / (2 * pad), h / (2 * pad)
    dist = np.sqrt(((xx - w / 2) / ex) ** 2 + ((yy - h / 2) / ey) ** 2)
    alpha = np.clip(1 - (dist - inner) / (pad - inner), 0, 1)
    alpha = np.where(dist <= inner, 1.0, alpha)
    alpha = alpha * alpha * (3 - 2 * alpha)
    mask_img = Image.fromarray((alpha * 255).astype(np.uint8), mode='L')
    rgba = crop.convert('RGBA')
    rgba.putalpha(mask_img)
    return rgba


print('Cutting out planet photos...')
PLANETS = {name: detect_and_cutout_ellipse(filename, precrop) for name, (filename, precrop) in _PLANET_SOURCES.items()}
for name, img in PLANETS.items():
    print(' ', name, img.size)


def planet_cutout(name):
    return PLANETS[name]


# ---------------------------------------------------------------------------
# Moon cutouts — each moon photo is auto-detected (largest bright connected blob against the
# black background) and given a soft round alpha edge, so it reads as a clean full-disk photo
# rather than an obviously-cropped rectangle. `precrop` trims a source image down first, for
# photos that ship as a multi-panel figure (only one panel wanted) or with two moons side by
# side (only one wanted).

def detect_and_cutout(filename, precrop=None, threshold=20, pad=1.15):
    img = Image.open(f'{SRC}/{filename}').convert('RGB')
    if precrop:
        img = img.crop(precrop)
    arr = np.array(img).astype(int)
    mask = arr.max(axis=2) > threshold
    labeled, n = ndimage.label(mask, structure=np.ones((3, 3), dtype=int))
    counts = np.bincount(labeled.ravel())
    counts[0] = 0
    best_label = counts.argmax()
    ys, xs = np.where(labeled == best_label)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    r = max(x1 - x0, y1 - y0) / 2 * pad
    box = (int(cx - r), int(cy - r), int(cx + r), int(cy + r))
    crop = img.crop(box)
    w, h = crop.size
    yy, xx = np.mgrid[0:h, 0:w]
    ccx, ccy = w / 2, h / 2
    half = min(w, h) / 2
    dist = np.sqrt((xx - ccx) ** 2 + (yy - ccy) ** 2) / half
    inner = 0.6
    alpha = np.clip(1 - (dist - inner) / (1 - inner), 0, 1)
    alpha = np.where(dist <= inner, 1.0, alpha)
    alpha = alpha * alpha * (3 - 2 * alpha)
    mask_img = Image.fromarray((alpha * 255).astype(np.uint8), mode='L')
    rgba = crop.convert('RGBA')
    rgba.putalpha(mask_img)
    return rgba


def full_frame_cutout(filename, inner=0.62):
    """For photos that are already a clean full-disk shot filling the frame (no threshold-based
    blob to find — Triton and the Moon's source photos have some frame-filling glow/halo)."""
    img = Image.open(f'{SRC}/{filename}').convert('RGB')
    w, h = img.size
    yy, xx = np.mgrid[0:h, 0:w]
    ccx, ccy = w / 2, h / 2
    half = min(w, h) / 2
    dist = np.sqrt((xx - ccx) ** 2 + (yy - ccy) ** 2) / half
    alpha = np.clip(1 - (dist - inner) / (1 - inner), 0, 1)
    alpha = np.where(dist <= inner, 1.0, alpha)
    alpha = alpha * alpha * (3 - 2 * alpha)
    mask_img = Image.fromarray((alpha * 255).astype(np.uint8), mode='L')
    rgba = img.convert('RGBA')
    rgba.putalpha(mask_img)
    return rgba


print('Cutting out moon photos...')
MOONS = {
    'io': detect_and_cutout('io-panels.jpg', precrop=(0, 0, 640, 655)),
    'europa': detect_and_cutout('europa-try2.jpg', precrop=(0, 0, 260, 260)),
    'ganymede': detect_and_cutout('ganymede-clean.jpg'),
    'callisto': detect_and_cutout('callisto-full.jpg'),
    'titania': detect_and_cutout('titania-full.jpg'),
    'ariel': detect_and_cutout('ariel-full.jpg'),
    'miranda': detect_and_cutout('miranda-full.jpg'),
    'umbriel': detect_and_cutout('umbriel-full.jpg'),
    'oberon': detect_and_cutout('oberon1.jpg'),
    'mimas': detect_and_cutout('mimas-full2.jpg', precrop=(0, 0, 1016, 700)),
    'tethys': detect_and_cutout('tethys-full.jpg'),
    'dione': detect_and_cutout('dione-full.jpg'),
    'rhea': detect_and_cutout('rhea-full.jpg'),
    'titan': detect_and_cutout('titan-panels.jpg', precrop=(60, 20, 560, 748)),
    'enceladus': detect_and_cutout('enceladus1.jpg'),
    'triton': full_frame_cutout('triton.jpg', inner=0.7),
    'phobos': detect_and_cutout('phobos-check.jpg'),
    'deimos': detect_and_cutout('deimos-check.jpg', precrop=(30, 40, 740, 732)),
    'moon': full_frame_cutout('moon-check1.jpg', inner=0.75),
}
for name, img in MOONS.items():
    print(' ', name, img.size)


def load_moon(name):
    return MOONS[name]


# ---------------------------------------------------------------------------
# Compositing

def make_background(W, H, seed):
    import random
    random.seed(seed)
    bg = Image.new('RGB', (W, H), (5, 5, 15))
    draw = ImageDraw.Draw(bg, 'RGBA')
    cx, cy = W / 2, H / 2
    vignette_r = max(W, H) * 0.75  # sized off the long axis so a wide canvas still vignettes at its edges
    for i in range(40, 0, -1):
        shade = 5 + int(9 * (i / 40))
        r = int(vignette_r * (i / 40))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(shade, shade, shade + 9))
    for _ in range(int(W * H / 3200)):
        x = random.randint(0, W - 1)
        y = random.randint(0, H - 1)
        b = random.randint(90, 255)
        size_px = random.choice([1, 1, 1, 2])
        a = random.randint(90, 220)
        draw.ellipse([x, y, x + size_px, y + size_px], fill=(b, b, min(255, b + 20), a))
    return bg


def paste(canvas, img, cx, cy, diameter):
    # diameter applies to the image's longer side; the shorter side scales to match so
    # non-square crops (e.g. Saturn's rings) aren't squished into a circle.
    w, h = img.size
    if w >= h:
        d_w = int(diameter)
        d_h = max(1, int(diameter * h / w))
    else:
        d_h = int(diameter)
        d_w = max(1, int(diameter * w / h))
    resized = img.resize((d_w, d_h), Image.LANCZOS)
    canvas.paste(resized, (int(cx - d_w / 2), int(cy - d_h / 2)), resized)


def draw_orbit_rings(canvas, cx, cy, radii_x, tilt=0.42):
    draw = ImageDraw.Draw(canvas, 'RGBA')
    for rx in radii_x:
        ry = rx * tilt
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], outline=(140, 150, 175, 90), width=2)


tilt = 0.42
results = {}

# Canvases were originally square, which — combined with orbit ellipses that are always much
# shorter than wide (tilt=0.42) — left a lot of empty starfield above/below the content. That
# wasn't just wasted space: the client's pan/zoom lets you zoom in and drag freely across the
# WHOLE canvas, so at higher zoom that empty margin was easy to pan into and get "lost" in —
# reported as "the whole screen goes black". Each canvas height below is sized off the actual
# content (the tallest orbit ellipse's half-height, plus the moon sitting on it, plus 35% pad)
# instead of just matching the width, so there's much less empty canvas to wander into.

# ---------------- JUPITER ----------------
W, H = 2000, 1100; cx, cy = W / 2, H / 2
bg = make_background(W, H, seed=1)
orbits = {'io': 420, 'europa': 540, 'ganymede': 660, 'callisto': 820}
draw_orbit_rings(bg, cx, cy, list(orbits.values()))
paste(bg, planet_cutout('jupiter'), cx, cy, 320)
moon_sizes = {'io': 92, 'europa': 82, 'ganymede': 112, 'callisto': 106}
angles = {'io': 15, 'europa': 110, 'ganymede': 200, 'callisto': 300}
res = {}
for name, rx in orbits.items():
    ry = rx * tilt
    a = math.radians(angles[name])
    px = cx + rx * math.cos(a)
    py = cy + ry * math.sin(a)
    paste(bg, load_moon(name), px, py, moon_sizes[name])
    res[name] = (round(px), round(py), moon_sizes[name] // 2)
bg.save(f'{ASSETS}/moons-jupiter.jpg', quality=90)
results['jupiter'] = {'viewbox': (W, H), 'moons': res}
print('jupiter done')

# ---------------- SATURN ----------------
W, H = 2200, 1300; cx, cy = W / 2, H / 2
bg = make_background(W, H, seed=2)
orbits = {'mimas': 360, 'enceladus': 450, 'tethys': 560, 'dione': 680, 'rhea': 820, 'titan': 1020}
draw_orbit_rings(bg, cx, cy, list(orbits.values()))
paste(bg, planet_cutout('saturn'), cx, cy, 480)  # 480 = long axis (rings); source art already includes the rings
moon_sizes = {'mimas': 46, 'enceladus': 54, 'tethys': 78, 'dione': 84, 'rhea': 88, 'titan': 110}
angles = {'mimas': 20, 'enceladus': 95, 'tethys': 160, 'dione': 230, 'rhea': 300, 'titan': 60}
res = {}
for name, rx in orbits.items():
    ry = rx * tilt
    a = math.radians(angles[name])
    px = cx + rx * math.cos(a)
    py = cy + ry * math.sin(a)
    paste(bg, load_moon(name), px, py, moon_sizes[name])
    res[name] = (round(px), round(py), moon_sizes[name] // 2)
bg.save(f'{ASSETS}/moons-saturn.jpg', quality=90)
results['saturn'] = {'viewbox': (W, H), 'moons': res}
print('saturn done')

# ---------------- URANUS ----------------
W, H = 1900, 1050; cx, cy = W / 2, H / 2
bg = make_background(W, H, seed=3)
orbits = {'miranda': 330, 'ariel': 430, 'umbriel': 540, 'titania': 660, 'oberon': 800}
draw_orbit_rings(bg, cx, cy, list(orbits.values()))
paste(bg, planet_cutout('uranus'), cx, cy, 300)
moon_sizes = {'miranda': 56, 'ariel': 82, 'umbriel': 84, 'titania': 100, 'oberon': 96}
angles = {'miranda': 30, 'ariel': 120, 'umbriel': 200, 'titania': 280, 'oberon': 340}
res = {}
for name, rx in orbits.items():
    ry = rx * tilt
    a = math.radians(angles[name])
    px = cx + rx * math.cos(a)
    py = cy + ry * math.sin(a)
    paste(bg, load_moon(name), px, py, moon_sizes[name])
    res[name] = (round(px), round(py), moon_sizes[name] // 2)
bg.save(f'{ASSETS}/moons-uranus.jpg', quality=90)
results['uranus'] = {'viewbox': (W, H), 'moons': res}
print('uranus done')

# ---------------- NEPTUNE ----------------
W, H = 1400, 720; cx, cy = W / 2, H / 2
bg = make_background(W, H, seed=4)
draw_orbit_rings(bg, cx, cy, [480])
paste(bg, planet_cutout('neptune'), cx, cy, 340)
a = math.radians(40)
px = cx + 480 * math.cos(a)
py = cy + 480 * tilt * math.sin(a)
paste(bg, load_moon('triton'), px, py, 130)
bg.save(f'{ASSETS}/moons-neptune.jpg', quality=90)
results['neptune'] = {'viewbox': (W, H), 'moons': {'triton': (round(px), round(py), 65)}}
print('neptune done')

# ---------------- MARS ----------------
W, H = 1300, 600; cx, cy = W / 2, H / 2
bg = make_background(W, H, seed=5)
draw_orbit_rings(bg, cx, cy, [330, 430])
paste(bg, planet_cutout('mars'), cx, cy, 300)
angles_m = {'phobos': 40, 'deimos': 200}
sizes_m = {'phobos': 80, 'deimos': 64}
orbits_m = {'phobos': 330, 'deimos': 430}
res = {}
for name, rx in orbits_m.items():
    ry = rx * tilt
    a = math.radians(angles_m[name])
    px = cx + rx * math.cos(a)
    py = cy + ry * math.sin(a)
    paste(bg, load_moon(name), px, py, sizes_m[name])
    res[name] = (round(px), round(py), sizes_m[name] // 2)
bg.save(f'{ASSETS}/moons-mars.jpg', quality=90)
results['mars'] = {'viewbox': (W, H), 'moons': res}
print('mars done')

# ---------------- EARTH ----------------
W, H = 1300, 700; cx, cy = W / 2, H / 2
bg = make_background(W, H, seed=6)
draw_orbit_rings(bg, cx, cy, [420])
paste(bg, planet_cutout('earth'), cx, cy, 320)
a = math.radians(50)
px = cx + 420 * math.cos(a)
py = cy + 420 * tilt * math.sin(a)
paste(bg, load_moon('moon'), px, py, 150)
bg.save(f'{ASSETS}/moons-earth.jpg', quality=90)
results['earth'] = {'viewbox': (W, H), 'moons': {'moon': (round(px), round(py), 75)}}
print('earth done')

with open(f'{HERE}/moons_composite_results.json', 'w') as f:
    json.dump(results, f, indent=2)
print(json.dumps(results, indent=2))
print()
print('If any viewbox/moon position above differs from packages/engine/src/moons.ts,')
print('update that file to match.')
