from pathlib import Path
import html, json, re, shutil, os
root = Path(__file__).resolve().parent
output = root / 'dist'
if output.exists():
    shutil.rmtree(output)
output.mkdir()
translations = json.loads((root / 'localization.json').read_text())
template = (root / 'index.html').read_text()
for key, values in translations.items():
    for code in ('ja', 'zh-Hant', 'ms', 'th', 'id', 'fil'):
        if not values.get(code): raise ValueError(f'Missing {code} translation: {key}')
labels = {'en': 'EN', 'ja': '日本語', 'zh-Hant': '繁中', 'ms': 'MS', 'th': 'ไทย', 'id': 'ID', 'fil': 'FIL'}
routes = {'en': 'en', 'ja': 'jp', 'zh-Hant': 'tw', 'ms': 'my', 'th': 'th', 'id': 'id', 'fil': 'ph'}
origin = (os.environ.get('SITE_URL') or os.environ.get('CF_PAGES_URL') or '').rstrip('/')
if not origin.startswith('https://'):
    raise ValueError('Set SITE_URL to the https:// website origin before building.')
for locale in labels:
    page = template
    if locale in ('th', 'id', 'fil'):
        prefix = '../assets/'
        font = 'noto-sans-thai' if locale == 'th' else 'inter'
        page = page.replace('</head>', '<link rel="preload" as="font" type="font/ttf" href="'+prefix+'fonts/'+font+'-400.ttf" crossorigin>\n</head>')
    if locale != 'en':
        def translate(match):
            value = html.unescape(match.group(0))
            key = value.strip()
            if key not in translations: return match.group(0)
            return value[:len(value)-len(value.lstrip())] + html.escape(translations[key][locale], quote=False) + value[len(value.rstrip()):]
        page = re.sub(r'(?<=>)[^<]+(?=<)', translate, page)
        def attr(match):
            key = html.unescape(match.group(2))
            return match.group(1) + html.escape(translations.get(key, {}).get(locale, key), quote=True) + '"'
        page = re.sub(r'((?:alt|aria-label|content)=")([^"]*)"', attr, page)
        page = page.replace('<html lang="en">', '<html lang="'+locale+'">')
        page = page.replace('<span>EN</span>', '<span>'+labels[locale]+'</span>')
    page = page.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/')
    page = page.replace('data-video-src="assets/', 'data-video-src="../assets/').replace('poster="assets/', 'poster="../assets/')
    page = page.replace('href="styles.css"', 'href="../styles.css"').replace('src="script.js"', 'src="../script.js"')
    if locale == 'id':
        page = page.replace('>2,986<', '>2.986<').replace('>2,640<', '>2.640<')
    for code in labels:
        old = './' if code == 'en' else code+'/'
        new = '/'+routes[code]+'/'
        page = page.replace('href="'+old+'" lang="'+code+'"', 'href="'+new+'" lang="'+code+'"'+(' aria-current="page"' if code == locale else ''))
    path = '/'+routes[locale]+'/'
    seo = '<link rel="canonical" href="'+origin+path+'">'
    for code in labels:
        url = origin + '/'+routes[code]+'/'
        seo += '<link rel="alternate" hreflang="'+code+'" href="'+url+'">'
    seo += '<link rel="alternate" hreflang="x-default" href="'+origin+'/">'
    page = page.replace('</head>', seo+'\n</head>')
    target = output / routes[locale]
    target.mkdir(exist_ok=True)
    (target / 'index.html').write_text(page)
    if locale == 'en':
        # Keep the homepage in English while /en remains directly shareable.
        (output / 'index.html').write_text(page.replace('../assets/', 'assets/').replace('../styles.css', 'styles.css').replace('../script.js', 'script.js'))
for name in ('styles.css', 'script.js'):
    shutil.copy2(root / name, output / name)
shutil.copytree(root / 'assets', output / 'assets', dirs_exist_ok=True)
redirects = []
for locale, route in routes.items():
    if locale != route:
        for old_path in ('/'+locale, '/'+locale+'/', '/'+locale+'/index.html'):
            redirects.append(f'{old_path} /{route}/ 301')
(output / '_redirects').write_text('\n'.join(redirects)+'\n')
print('Built 7 localized pages:', ', '.join('/'+route for route in routes.values()), 'in', output)
