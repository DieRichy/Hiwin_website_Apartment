from pathlib import Path
import html, json, re, shutil, os
import xml.etree.ElementTree as ET
root = Path(__file__).resolve().parent
output = root / 'dist'
if output.exists():
    shutil.rmtree(output)
output.mkdir()
translations = json.loads((root / 'localization.json').read_text())
template = (root / 'index.html').read_text()
for key, values in translations.items():
    for code in ('ja', 'zh-Hant', 'ms', 'th', 'id', 'fil', 'ko'):
        if not values.get(code): raise ValueError(f'Missing {code} translation: {key}')
# Inner pages (pages/*.html): shared head, header and contact parts; strings in pages/localization.json.
# The support part (floating one-stop support dock) goes on every page except the contact page it links to.
pages_dir = root / 'pages'
part = {name: (pages_dir / ('_'+name+'.html')).read_text() for name in ('head', 'header', 'contact', 'support')}
inner_pages = sorted(p.stem for p in pages_dir.glob('*.html') if not p.stem.startswith('_'))
page_translations = json.loads((pages_dir / 'localization.json').read_text())
for key, values in page_translations.items():
    for code in ('ja', 'zh-Hant', 'ms', 'th', 'id', 'fil', 'ko'):
        if not values.get(code): raise ValueError(f'Missing {code} translation in pages/localization.json: {key}')
    # Shared strings keep one translation site-wide, so they live only in localization.json.
    if key in translations: raise ValueError(f'pages/localization.json duplicates localization.json: {key}')
all_translations = {**translations, **page_translations}
labels = {'en': 'EN', 'ja': '日本語', 'zh-Hant': '繁中', 'ms': 'MS', 'th': 'ไทย', 'id': 'ID', 'fil': 'FIL', 'ko': '한국어'}
routes = {'en': 'en', 'ja': 'jp', 'zh-Hant': 'tw', 'ms': 'my', 'th': 'th', 'id': 'id', 'fil': 'ph', 'ko': 'ko'}
origin = (os.environ.get('SITE_URL') or os.environ.get('CF_PAGES_URL') or '').rstrip('/')
if not origin.startswith('https://'):
    raise ValueError('Set SITE_URL to the https:// website origin before building.')
og_locales = {'en': 'en_US', 'ja': 'ja_JP', 'zh-Hant': 'zh_TW', 'ms': 'ms_MY', 'th': 'th_TH', 'id': 'id_ID', 'fil': 'fil_PH', 'ko': 'ko_KR'}
# Brand names people search for: parent company HIWIN, hotel brand Apartment Hotel 11, Chinese brand name 住一.
brand_names = ['住一', 'Apartment Hotel 11 (Eleven)', 'アパートメントホテル11']
def structured_data(locale, path, page):
    """Schema.org JSON-LD for Google: the company, its hotel brand, contact point and this language page."""
    title = html.unescape(re.search(r'<title>(.*?)</title>', page, re.S).group(1)).strip()
    description = html.unescape(re.search(r'<meta name="description" content="([^"]*)"', page).group(1))
    org_id = origin + '/#organization'
    data = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': org_id,
                'name': 'HIWIN',
                'url': origin + '/',
                'logo': origin + '/assets/hiwin-logo.svg',
                'sameAs': ['https://hiwin-japan.co.jp/'],
                'brand': {'@type': 'Brand', 'name': 'Apartment Hotel 11', 'alternateName': brand_names,
                          'logo': origin + '/assets/apartment11-logo.png'},
                'address': {'@type': 'PostalAddress', 'streetAddress': '13F Quartz Shinsaibashi, 3-12-14 Minamisenba, Chuo-ku',
                            'addressLocality': 'Osaka', 'addressRegion': 'Osaka', 'postalCode': '542-0081', 'addressCountry': 'JP'},
                'contactPoint': {'@type': 'ContactPoint', 'telephone': '+81-70-3205-9967', 'contactType': 'sales',
                                 'areaServed': ['MY', 'SG', 'TH', 'ID', 'PH', 'TW', 'HK', 'KR']},
            },
            {
                '@type': 'WebPage',
                '@id': origin + path + '#webpage',
                'url': origin + path,
                'name': title,
                'description': description,
                'inLanguage': locale,
                'publisher': {'@id': org_id},
                'about': {'@id': org_id},
            },
        ],
    }
    # Keep "</" out of the inline script so the JSON can never close the tag early.
    return json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
def localize(page, locale, table):
    """Replace English text nodes and alt/aria-label/content attributes with the locale's translation."""
    def translate(match):
        value = html.unescape(match.group(0))
        key = value.strip()
        if key not in table or not table[key].get(locale): return match.group(0)
        return value[:len(value)-len(value.lstrip())] + html.escape(table[key][locale], quote=False) + value[len(value.rstrip()):]
    page = re.sub(r'(?<=>)[^<]+(?=<)', translate, page)
    def attr(match):
        key = html.unescape(match.group(2))
        return match.group(1) + html.escape(table.get(key, {}).get(locale, key), quote=True) + '"'
    page = re.sub(r'((?:alt|aria-label|content)=")([^"]*)"', attr, page)
    return page.replace('<html lang="en">', '<html lang="'+locale+'">').replace('<span>EN</span>', '<span>'+labels[locale]+'</span>')
for locale in labels:
    page = template.replace('</body>', part['support'].replace('{home}', '/'+routes[locale]+'/')+'</body>')
    for slug in inner_pages:
        page = page.replace('href="'+slug+'/"', 'href="/'+routes[locale]+'/'+slug+'/"')
    if locale in ('th', 'id', 'fil'):
        prefix = '../assets/'
        font = 'noto-sans-thai' if locale == 'th' else 'inter'
        page = page.replace('</head>', '<link rel="preload" as="font" type="font/ttf" href="'+prefix+'fonts/'+font+'-400.ttf" crossorigin>\n</head>')
    if locale != 'en':
        page = localize(page, locale, all_translations)
    page = page.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/')
    page = page.replace('data-video-src="assets/', 'data-video-src="../assets/').replace('poster="assets/', 'poster="../assets/')
    page = page.replace('href="styles.css"', 'href="../styles.css"').replace('src="script.js"', 'src="../script.js"').replace('src="analytics.js"', 'src="../analytics.js"')
    if locale == 'id':
        page = page.replace('>3,000+<', '>3.000+<').replace('>2,640<', '>2.640<')
    for code in labels:
        old = './' if code == 'en' else code+'/'
        new = '/'+routes[code]+'/'
        page = page.replace('href="'+old+'" lang="'+code+'"', 'href="'+new+'" lang="'+code+'"'+(' aria-current="page"' if code == locale else ''))
    path = '/'+routes[locale]+'/'
    seo = '<link rel="canonical" href="'+origin+path+'">'
    for code in labels:
        url = origin + '/'+routes[code]+'/'
        seo += '<link rel="alternate" hreflang="'+code+'" href="'+url+'">'
    seo += '<link rel="alternate" hreflang="x-default" href="'+origin+'/en/">'
    # Share previews (WhatsApp, LINE, Facebook) need absolute URLs and a locale.
    seo += '<meta property="og:url" content="'+origin+path+'">'
    seo += '<meta property="og:image" content="'+origin+'/assets/og-image.jpg">'
    seo += '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
    seo += '<meta property="og:locale" content="'+og_locales[locale]+'">'
    for code in labels:
        if code != locale:
            seo += '<meta property="og:locale:alternate" content="'+og_locales[code]+'">'
    seo += '<script type="application/ld+json">'+structured_data(locale, path, page)+'</script>'
    page = page.replace('</head>', seo+'\n</head>')
    target = output / routes[locale]
    target.mkdir(exist_ok=True)
    (target / 'index.html').write_text(page)
names = {'en': 'English', 'ja': '日本語', 'zh-Hant': '繁體中文', 'ms': 'Bahasa Melayu', 'th': 'ไทย', 'id': 'Bahasa Indonesia', 'fil': 'Filipino', 'ko': '한국어'}
for slug in inner_pages:
    source = (pages_dir / (slug+'.html')).read_text()
    title = re.search(r'<!--title:(.*?)-->', source).group(1)
    description = re.search(r'<!--description:(.*?)-->', source).group(1)
    body = re.sub(r'<!--(title|description):.*?-->\n', '', source)
    for locale in labels:
        route = routes[locale]
        path = '/'+route+'/'+slug+'/'
        head = part['head'].replace('{title}', html.escape(title, quote=False), 1).replace('{title}', html.escape(title)).replace('{description}', html.escape(description))
        # The contact page lists every channel itself, so it skips the contact panel and the dock.
        extras = ('', '') if slug == 'contact' else (part['contact'], part['support'])
        page = head+'<body class="inner-page">\n'+part['header']+'  <main id="main">\n'+body+extras[0]+'  </main>\n'+extras[1]+'</body>\n</html>\n'
        page = page.replace('{home}', '/'+route+'/')
        menu = ''.join('<a href="/'+routes[code]+'/'+slug+'/" lang="'+code+'" hreflang="'+code+'">'+names[code]+'</a>' for code in labels)
        page = page.replace('<!--languages-->', menu)
        # Mark the current page in the navigation.
        page = page.replace('<a href="'+path+'">', '<a href="'+path+'" class="active" aria-current="page">')
        if locale != 'en':
            page = localize(page, locale, all_translations)
        if locale in ('th', 'id', 'fil'):
            font = 'noto-sans-thai' if locale == 'th' else 'inter'
            page = page.replace('</head>', '<link rel="preload" as="font" type="font/ttf" href="/assets/fonts/'+font+'-400.ttf" crossorigin>\n</head>')
        if locale == 'id':
            page = page.replace('JPY 2,000', 'JPY 2.000').replace('3,000', '3.000')
        seo = '<link rel="canonical" href="'+origin+path+'">'
        for code in labels:
            seo += '<link rel="alternate" hreflang="'+code+'" href="'+origin+'/'+routes[code]+'/'+slug+'/">'
        seo += '<link rel="alternate" hreflang="x-default" href="'+origin+'/en/'+slug+'/">'
        seo += '<meta property="og:url" content="'+origin+path+'">'
        seo += '<meta property="og:image" content="'+origin+'/assets/og-image.jpg">'
        seo += '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
        seo += '<meta property="og:locale" content="'+og_locales[locale]+'">'
        for code in labels:
            if code != locale:
                seo += '<meta property="og:locale:alternate" content="'+og_locales[code]+'">'
        seo += '<script type="application/ld+json">'+structured_data(locale, path, page)+'</script>'
        page = page.replace('</head>', seo+'\n</head>')
        target = output / route / slug
        target.mkdir(parents=True, exist_ok=True)
        (target / 'index.html').write_text(page)
for name in ('styles.css', 'script.js', 'page.js', 'analytics.js', 'support.js'):
    shutil.copy2(root / name, output / name)
shutil.copytree(root / 'assets', output / 'assets', dirs_exist_ok=True)
# The root permanently redirects to /en/. A copy of the English page at / made Google pick / as the
# canonical and leave /en/ unindexed ("Duplicate, Google chose different canonical than user").
redirects = ['/ /en/ 301']
for locale, route in routes.items():
    if locale != route:
        for old_path in ('/'+locale, '/'+locale+'/', '/'+locale+'/index.html'):
            redirects.append(f'{old_path} /{route}/ 301')
(output / '_redirects').write_text('\n'.join(redirects)+'\n')
# Publish only canonical language URLs; the root redirects to /en/.
namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
# Cache busting: Cloudflare lets browsers keep CSS/JS for 4 hours, so a new page could load with an old
# stylesheet. Tag every CSS/JS reference with a hash of the file content; a changed file gets a new URL.
import hashlib
versions = {name: hashlib.sha1((root / name).read_bytes()).hexdigest()[:10] for name in ('styles.css', 'script.js', 'page.js', 'analytics.js', 'support.js')}
for page_path in output.rglob('*.html'):
    text = page_path.read_text()
    text = re.sub(r'((?:href|src)="[^"]*?(styles\.css|script\.js|page\.js|analytics\.js|support\.js))"', lambda m: m.group(1)+'?v='+versions[m.group(2)]+'"', text)
    page_path.write_text(text)
ET.register_namespace('', namespace)
sitemap = ET.Element('{'+namespace+'}urlset')
for route in routes.values():
    entry = ET.SubElement(sitemap, '{'+namespace+'}url')
    ET.SubElement(entry, '{'+namespace+'}loc').text = origin + '/' + route + '/'
for slug in inner_pages:
    for route in routes.values():
        entry = ET.SubElement(sitemap, '{'+namespace+'}url')
        ET.SubElement(entry, '{'+namespace+'}loc').text = origin + '/' + route + '/' + slug + '/'
ET.ElementTree(sitemap).write(output / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
(output / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+origin+'/sitemap.xml\n', encoding='utf-8')
print('Built 8 localized pages:', ', '.join('/'+route for route in routes.values()), '+ inner pages:', ', '.join(inner_pages), 'in', output)
