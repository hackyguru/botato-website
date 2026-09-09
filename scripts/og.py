"""The share card: black, with the mark in the middle of it.

Drawn from the outline lib/blob.ts generates rather than from a picture of
one, so the potato here is the shape the site renders. Centred on the mark's
own bounding box instead of its 100x100 layout box, because the generator
leaves slack on whichever axis the body is narrower in, and centring the box
would sit the logo slightly off.

    python3 scripts/og.py
"""
import json
import numpy as np
from PIL import Image, ImageDraw

W, H, S = 1200, 630, 4          # supersampled, then downscaled
MARK = 200                      # the mark's height in final pixels
SCRATCH = "/private/tmp/claude-501/-Users-guru-Desktop-indie-botcage/7c92e89a-73e0-4ea7-be92-668e97d3ee76/scratchpad"
mark = json.load(open(f"{SCRATCH}/pebble.json"))

FLOOR, SKIN = (0, 0, 0), (200, 160, 106)
img = Image.new("RGB", (W * S, H * S), FLOOR)

xs = [p[0] for p in mark["pts"]]
ys = [p[1] for p in mark["pts"]]
span = max(max(xs) - min(xs), max(ys) - min(ys))
u = MARK * S / span                                   # pixels per outline unit
ox = W * S / 2 - (min(xs) + max(xs)) / 2 * u
oy = H * S / 2 - (min(ys) + max(ys)) / 2 * u
at = lambda x, y: (ox + x * u, oy + y * u)

poly = [at(x, y) for x, y in mark["pts"]]
ImageDraw.Draw(img).polygon(poly, fill=SKIN)

clip = Image.new("L", img.size, 0)
ImageDraw.Draw(clip).polygon(poly, fill=255)
inside = np.asarray(clip, dtype=np.float32) / 255.0

# The two washes BrandMark paints over the body, as Paints.tsx defines them and
# resolved against the path's own bounding box, which is what an SVG gradient
# with objectBoundingBox units means.
bx0, by0 = at(min(xs), min(ys))
bx1, by1 = at(max(xs), max(ys))
bw, bh = bx1 - bx0, by1 - by0
yy, xx = np.mgrid[0 : img.size[1], 0 : img.size[0]].astype(np.float32)
fx, fy = (xx - bx0) / bw, (yy - by0) / bh

base = np.asarray(img, dtype=np.float32)

# face-lo: black, transparent at 45% of the height down to 0.22 at the foot.
lo = np.clip((fy - 0.45) / 0.55, 0.0, 1.0) * 0.22 * inside
base *= (1.0 - lo)[..., None]

# face-hi: white, 0.34 at (32%, 22%) falling to nothing at 0.7 of the box.
r = np.sqrt((fx - 0.32) ** 2 + (fy - 0.22) ** 2) / 0.70
hi = np.clip(1.0 - r, 0.0, 1.0) * 0.34 * inside
base = base + (255.0 - base) * hi[..., None]

img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))

d = ImageDraw.Draw(img)
er = mark["eyeR"] * u
ey = oy + mark["eyeY"] * u
for side in (-1, 1):
    ex = ox + (50 + side * mark["eyeGap"]) * u
    d.ellipse([ex - er, ey - er, ex + er, ey + er], fill=(0, 0, 0))

img.resize((W, H), Image.LANCZOS).save("public/og.png", "PNG", optimize=True)
print("public/og.png written")
