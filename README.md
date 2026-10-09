# HIWIN Travel Agency Partnerships

Static website with 8 languages, hosted on Cloudflare Pages; migrated from Sites version 17.

Source baseline: 68fae8f91ddd6431381e50adafb11338ee05d34a.

## Cloudflare Pages

- Build command: `python3 build.py`
- Build output directory: `dist`
- Production branch: `main`
- Framework preset: None
- `SITE_URL`: final HTTPS custom-domain origin. When absent, the build uses Cloudflare’s `CF_PAGES_URL`.

Production custom domain: `hiwin-partners.com`. Set `SITE_URL=https://hiwin-partners.com` in Cloudflare Pages before the production build.

Attach the custom domain in Pages and use its supplied DNS record in Cloudflare. The existing company domain and website are not part of this migration.

To update the website, edit source files and push to `main`. Pages builds and deploys the update automatically once Git integration is connected.

No backend, database or runtime secret is required. Do not upload internal research or Sites credentials to this repository.

## Language URLs

| Path | Language | HTML language |
| --- | --- | --- |
| `/en/` | English | `en` |
| `/jp/` | Japanese | `ja` |
| `/tw/` | Traditional Chinese (Taiwan) | `zh-Hant` |
| `/my/` | Malay | `ms` |
| `/th/` | Thai | `th` |
| `/id/` | Indonesian | `id` |
| `/ph/` | Filipino | `fil` |
| `/ko/` | Korean | `ko` |

The root `/` permanently redirects to `/en/`. Existing `/ja/`, `/zh-Hant/`, `/ms/`, and `/fil/` links permanently redirect to their new paths, including their forms without a trailing slash. The language menu, canonical URLs, and hreflang links use the new paths. Translation keys remain language codes, separate from URL paths.

## Current maintenance context · October 3, 2026

The production website is https://hiwin-partners.com on Cloudflare Pages (project `hiwin-partners`), backed by the private GitHub repository `DieRichy/Hiwin_website_Apartment`. This `agency-cloudflare` directory is the source checkout to edit. Push verified changes to `main` to trigger production deployment. The previous Sites hostname and sibling `agency` checkout are legacy; use this Cloudflare project for future website updates.

Korean uses locally hosted Noto Sans KR variable WOFF2 subsets with the included SIL OFL license, whole-word wrapping and responsive heading/spacing rules. All 187 copy entries, metadata and accessibility/media labels are localized. `/` redirects to `/en/`; language codes and public route names stay separate.

## SEO crawl files

The build generates `sitemap.xml` with the eight canonical language homepages and `robots.txt` with the sitemap URL. Both use the configured HTTPS site origin. The root `/` 301-redirects to `/en/` (an English copy at `/` made Google index `/` instead of `/en/`), and `x-default` hreflang points to `/en/`. Language alternatives remain in the HTML `hreflang` links.

Submit `https://hiwin-partners.com/sitemap.xml` to the domain property in Google Search Console after deployment. Submission does not guarantee indexing.

## GA4 measurement

The production hostname `hiwin-partners.com` uses GA4 measurement ID `G-TNJQEP3WWM` (web stream `hp main site`). The Google tag appears once on every language page. Other hostnames, including local and Cloudflare preview addresses, do not initialize this property.

`analytics.js` sends one `contact_click` event for an Email, phone, WhatsApp or LINE link click. Parameters are `contact_channel` and `site_language`; the custom event does not include destination contact details or link text. A contact click is not a confirmed enquiry. Enhanced measurement remains managed in GA4.

Validate installation using the stream's Google tag test and GA4 Realtime. For channel and language breakdowns in standard reports, create event-scoped custom dimensions for these two event parameters.

## Brand names and share metadata · October 7, 2026

Search and share metadata use three brand names together: parent company **HIWIN**, hotel brand **Apartment Hotel 11**, and its Chinese name **住一**. “HIWIN” alone is shared with an unrelated industrial company, so page titles lead with “Apartment Hotel 11” (Traditional Chinese leads with “住一 Apartment Hotel 11”).

- Page `<title>` and meta description are localization keys in `localization.json`; `og:title` and `og:description` reuse the same keys, so each language stays in sync automatically.
- `build.py` adds per-language `og:url`, `og:locale` (+ alternates) and an absolute `og:image` (`assets/og-image.jpg`, 1200×630, cropped from the `apartment-intro.jpg` entrance photo) for WhatsApp, LINE and Facebook previews.
- `build.py` also adds Schema.org JSON-LD: an `Organization` (HIWIN, address, sales contact, `Brand` Apartment Hotel 11 with alternate names including 住一) and a `WebPage` per language. Update `structured_data()` if the address, phone number or brand names change.

After deployment, validate with Google's Rich Results Test and the Facebook Sharing Debugger (which also refreshes cached previews).

## Agency pages · October 7, 2026

Two inner pages target travel-agency searches, in all 8 languages:

| Path | Purpose |
| --- | --- |
| `/<lang>/osaka-accommodation/` | Featured Osaka properties, one featured room type each, with photos |
| `/<lang>/travel-agency-partnership/` | Why partner, stay conditions, cancellation policy, booking steps, FAQ |

- Source: `pages/<slug>.html` (English body; first lines hold `<!--title:…-->` and `<!--description:…-->`) plus shared `pages/_head.html`, `_header.html`, `_contact.html`. `build.py` builds every `pages/*.html` not starting with `_`, adds canonical, `hreflang`, Open Graph and JSON-LD, and lists them in `sitemap.xml`. Inner pages use `page.js` instead of `script.js`.
- Strings: `pages/localization.json`, all seven languages required. Strings already in `localization.json` (navigation, contact labels, property names) are reused from there; the build rejects duplicates so each string has one translation site-wide. English is the base; translations are localized, not literal.
- Homepage links to the pages (`href="osaka-accommodation/"` / `href="travel-agency-partnership/"`) are rewritten per language by the build.
- Content rules: every property is labelled as a featured selection, and the page says more properties and room types are available on request. Partner rates are never published; the rate sheet is sent on enquiry. Room data and stay conditions follow the rate sheet "Apartment Hotel 11 價格表 2026.10" (Google Drive, HIWIN 物業資料 folder; it is updated from time to time, so check for a newer sheet before editing); access and facilities follow the property brochures and apartmenthotel11.com. Property photos in `assets/stays/` are 640×800 crops of the main photos on apartmenthotel11.com.

## Cache busting · October 7, 2026

Cloudflare serves CSS/JS with `cache-control: max-age=14400` (4 hours), so after a release a returning visitor could get new HTML with an old stylesheet. `build.py` appends `?v=<content hash>` to every `styles.css`, `script.js`, `page.js` and `analytics.js` reference in the built HTML, so a changed file always gets a new URL. No manual step is needed.

## Contact page, support dock and QR codes · October 9, 2026

- `/<lang>/contact/` (`pages/contact.html`) lists every channel: one QR card per app, WhatsApp and LINE for +81 70-3205-9967 plus WeChat (tap on a phone, scan from a computer; the +81 70-5669-8688 accounts appear only in the contact panels on the other pages), side by side on wide screens, then email, phone and the office address. Wide screens show the three groups side by side; phones show one group at a time under WhatsApp / LINE / WeChat tabs (`page.js`), opening on LINE for Japanese, Traditional Chinese and Thai and on WhatsApp otherwise. It has no contact panel and no dock, since it is the page both point to.
- The one-stop support dock (`pages/_support.html`, `support.js`) sits bottom right on every other page and links to the contact page in the current language. On desktop visitors can minimise it to a small button; the choice is kept in `localStorage`. On phones it is a small icons-only button that opens the contact page in one tap and slides away while the visitor scrolls down, returning on any scroll up. It stays hidden while the homepage hero fills the screen and while the contact panel is in view.
- The contact panel on every page is a stack of labelled blocks: TEL (the big phone number), Email, the QR codes (label "Messaging apps · Scan to chat"; each language uses its usual term, e.g. 通訊軟體, メッセージアプリ, 메신저, aplikasi pemesejan) and the company address. WhatsApp and LINE numbers appear only under their QR codes, in two rows, one per number: +81 70-3205-9967 (WhatsApp, LINE, WeChat) and +81 70-5669-8688 (WhatsApp, LINE). Chat links use `wa.me/<number>` and the LINE `ti/p` links; the QR codes hold the links each account's own QR shows.
- QR codes are SVGs in `assets/qr/`, generated by `tools/qr.py` (run locally with the `qrcode` package; the Cloudflare build does not run it). To replace a code, decode the account's new QR image, update its link in `tools/qr.py`, rerun it and check the result scans. Channel icons are single-colour SVGs in `assets/icons/`, drawn in the text colour with CSS masks (`.ch-whatsapp`, `.ch-line`, `.ch-wechat`).

## Homepage as a hub · October 9, 2026

Once the agency pages existed, the homepage still carried the whole one-page brochure (about 10.5 screens on a computer, 11 on a phone). It now introduces the company and sends visitors on: about 6.5–7 screens on a computer and 8 on a phone.

- Order: hero → for travel agencies (heading, 60+ / 3,000+ / 6 figures, the two agency-page cards) → 01 portfolio (properties per city as chips, one-row photo carousel; every photo links to the Osaka page) → 02 about Apartment Hotel 11 (the hotel brand, with HIWIN as operator in one sentence) → 03 beyond accommodation (four cards with small thumbnails: dine, move, relax, enjoy; on computers the dining card lists the restaurant genres) → contact panel.
- Removed from the homepage: the four partnership models, the five-step process (the partnership page has its own four steps), the city table, the six-restaurant gallery and the longer HIWIN company introduction. Their translations were removed from `localization.json`.
- The homepage contact panel is the same as on the inner pages (`op-contact`), with one difference on phones (`home-contact`): chat apps are full-width buttons instead of QR codes. WeChat links to `contact/#cp-wechat`, which opens the contact page on its WeChat tab (`page.js`).
- The hero's bottom strip says who the site is for and links individual travellers to apartmenthotel11.com in their language (`direct_booking` in `build.py`: Japanese, Traditional Chinese and Korean have their own pages, other languages use `/en/`).
- The HIWIN logo in the homepage header now goes to the homepage, as on the inner pages; the corporate website stays linked in the footer.
- `build.py` also rewrites inner-page links that carry a fragment (`contact/#cp-wechat`).
- Partnership page (`travel-agency-partnership.html`): section 01 lists the four partnership models from the company brochure (合作模式: FIT／自由行, 團體旅遊, 旅行社及銷售通路, 聯合推廣). The Traditional Chinese follows the brochure word for word; other languages are translated from it. Keep it in step with the brochure.
- Osaka page: under each card's featured room type, a note gives the number of room types at that property (from the property brochures, Traditional Chinese edition, October 2026). Kuromon 8 and Namba Minami 3 have a single room type, so their cards have no note. Update the counts in `osaka-accommodation.html` and `pages/localization.json` if a property's room types change.
- Contact panel layout (every page): the photo is a banner on top at every width. From 900px wide the details below it use two columns, with phone, email and address on the left and the chat QR codes on the right. App names and numbers under the QR codes use Arial so they fit three columns on narrow phones in every language.
- Enquiry notes: the contact panel (every page) and the contact page say what to send for a quote (stay dates, guests, rooms) and that replies usually come within 2 hours during business hours (`.contact-notes`).
- Traditional Chinese wording: the brand type is 公寓式飯店 (as in the brochure); otherwise say 住宿 (accommodation), 館 for one building (心齋橋9號館, 60 多館) and 館別 for "which property". Never 物業, which reads as real estate in Taiwan, and not plain 飯店, which suggests a full-service hotel with a front desk.
