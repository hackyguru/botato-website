"""The share card, drawn from the same outline the site draws its mark with."""
import json, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, S = 1200, 630, 3          # supersampled, then downscaled
SCRATCH = "/private/tmp/claude-501/-Users-guru-Desktop-indie-botcage/7c92e89a-73e0-4ea7-be92-668e97d3ee76/scratchpad"
mark = json.load(open(f"{SCRATCH}/pebble.json"))

FLOOR, SKIN, FG, FG2 = (12, 12, 12), (200, 160, 106), (242, 242, 242), (142, 142, 147)
img = Image.new("RGB", (W * S, H * S), FLOOR)
d = ImageDraw.Draw(img)

# A wash of the app's own accents, the way the hero has one.
glow = Image.new("RGB", (W * S, H * S), FLOOR)
g = ImageDraw.Draw(glow)
for cx, cy, r, col in [
    (0.16, 0.30, 0.55, (255, 90, 0)), (0.82, 0.22, 0.50, (10, 132, 255)),
    (0.68, 0.90, 0.55, (191, 90, 242)), (0.34, 0.95, 0.45, (240, 178, 50)),
]:
    x, y, rr = cx * W * S, cy * H * S, r * H * S
    g.ellipse([x - rr, y - rr, x + rr, y + rr], fill=col)
glow = glow.filter(ImageFilter.GaussianBlur(radius=150 * S))
img = Image.blend(img, glow, 0.22)
d = ImageDraw.Draw(img)

# The mark, at the exact outline lib/blob.ts produces.
MX, MY, MS = 104 * S, 128 * S, 3.7 * S          # box origin and units-per-point
poly = [(MX + x * MS, MY + y * MS) for x, y in mark["pts"]]
d.polygon(poly, fill=SKIN)
shade = Image.new("RGB", img.size, FLOOR)
sd = ImageDraw.Draw(shade)
box = [MX, MY, MX + 100 * MS, MY + 100 * MS]
sd.ellipse([box[0], MY + 46 * MS, box[2], box[3] + 30 * MS], fill=(0, 0, 0))
mask = Image.new("L", img.size, 0)
ImageDraw.Draw(mask).polygon(poly, fill=64)
img.paste(Image.composite(shade, img, mask.point(lambda v: v)), (0, 0))
d = ImageDraw.Draw(img)
hi = Image.new("RGB", img.size, (255, 255, 255))
hm = Image.new("L", img.size, 0)
ImageDraw.Draw(hm).ellipse([MX + 6 * MS, MY + 2 * MS, MX + 62 * MS, MY + 52 * MS], fill=70)
hm = hm.filter(ImageFilter.GaussianBlur(radius=14 * S))
clip = Image.new("L", img.size, 0)
ImageDraw.Draw(clip).polygon(poly, fill=255)
hm = Image.composite(hm, Image.new("L", img.size, 0), clip)
img.paste(Image.composite(hi, img, hm), (0, 0))
d = ImageDraw.Draw(img)

er = mark["eyeR"] * MS
for side in (-1, 1):
    ex = MX + (50 + side * mark["eyeGap"]) * MS
    ey = MY + mark["eyeY"] * MS
    d.ellipse([ex - er, ey - er, ex + er, ey + er], fill=(0, 0, 0))

MEDIUM, REGULAR = 10, 0
def font(size, weight=MEDIUM):
    return ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", size * S, index=weight)

TX = MX + 100 * MS + 72 * S
d.text((TX, 206 * S), "botato", font=font(120), fill=FG)
d.text((TX, 352 * S), "Bots that live on your own machine.", font=font(38, REGULAR), fill=FG)
d.text((TX, 410 * S), "Each one gets a memory, a schedule and a computer", font=font(32, REGULAR), fill=FG2)
d.text((TX, 454 * S), "of its own. Shut the lid and they carry on.", font=font(32, REGULAR), fill=FG2)

img.resize((W, H), Image.LANCZOS).save("public/og.png", "PNG", optimize=True)
print("public/og.png written")
