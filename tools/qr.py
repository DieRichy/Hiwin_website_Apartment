"""Generate the contact QR codes in assets/qr/ (run locally: pip install qrcode; python3 tools/qr.py).

Each code holds the same link as the QR image the account itself shows (WhatsApp "QR code", LINE
"add friend" page, WeChat "My QR code"), redrawn as a crisp SVG with the channel icon in the middle.
High error correction keeps the codes readable with the icon covering the centre.
"""
from pathlib import Path
import re
import qrcode

root = Path(__file__).resolve().parent.parent
codes = {
    # WhatsApp business account "HIWIN Apartment 11", +81 70-3205-9967
    'whatsapp-7032059967': ('https://wa.me/qr/WWKVQQRS3K4CB1?s=r', 'whatsapp'),
    # WhatsApp "HIWIN Liping Wang", +81 70-5669-8688
    'whatsapp-7056698688': ('https://wa.me/qr/XWCNREQMSVFQL1', 'whatsapp'),
    # LINE, +81 70-3205-9967 (Chen Xian)
    'line-7032059967': ('https://line.me/ti/p/4f6w-2z54b', 'line'),
    # LINE, +81 70-5669-8688 (Liping Wang)
    'line-7056698688': ('https://line.me/ti/p/5MqWu953ES', 'line'),
    # WeChat "AM2課 陳 先"
    'wechat-chen-xian': ('https://u.wechat.com/kONreVwcoC63zArDsIKdHNo?s=2', 'wechat'),
}
ink = '#25231f'
quiet = 3  # modules of white margin, so the code scans on any background
for name, (url, icon) in codes.items():
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0)
    qr.add_data(url)
    qr.make(fit=True)
    matrix = qr.get_matrix()
    n = len(matrix)
    size = n + 2 * quiet
    # One horizontal run per path segment keeps the file small.
    runs = []
    for y, row in enumerate(matrix):
        x = 0
        while x < n:
            if row[x]:
                start = x
                while x < n and row[x]:
                    x += 1
                runs.append(f'M{start+quiet} {y+quiet}h{x-start}v1h{start-x}z')
            else:
                x += 1
    # Centre badge: a white square on the module grid, an ink circle and the white channel icon.
    badge = n // 4 | 1
    b0 = quiet + (n - badge) // 2
    centre = size / 2
    glyph = re.search(r' d="([^"]+)"', (root / 'assets/icons' / (icon + '.svg')).read_text()).group(1)
    r = badge / 2 - 0.6
    scale = r * 1.15 / 24
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" shape-rendering="crispEdges">'
           f'<rect width="{size}" height="{size}" fill="#fff"/>'
           f'<path fill="{ink}" d="{"".join(runs)}"/>'
           f'<rect x="{b0}" y="{b0}" width="{badge}" height="{badge}" fill="#fff"/>'
           f'<circle cx="{centre}" cy="{centre}" r="{r:.2f}" fill="{ink}" shape-rendering="geometricPrecision"/>'
           f'<path fill="#fff" fill-rule="evenodd" shape-rendering="geometricPrecision" '
           f'transform="translate({centre - 12*scale:.3f} {centre - 12*scale:.3f}) scale({scale:.4f})" d="{glyph}"/>'
           '</svg>\n')
    (root / 'assets/qr' / (name + '.svg')).write_text(svg)
    print(name, f'version {qr.version}, {n}x{n} modules, badge {badge}x{badge}')
