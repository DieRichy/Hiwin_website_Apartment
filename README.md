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

The root homepage also displays English. Existing `/ja/`, `/zh-Hant/`, `/ms/`, and `/fil/` links permanently redirect to their new paths, including their forms without a trailing slash. The language menu, canonical URLs, and hreflang links use the new paths. Translation keys remain language codes, separate from URL paths.

## Current maintenance context · October 3, 2026

The production website is https://hiwin-partners.com on Cloudflare Pages (project `hiwin-partners`), backed by the private GitHub repository `DieRichy/Hiwin_website_Apartment`. This `agency-cloudflare` directory is the source checkout to edit. Push verified changes to `main` to trigger production deployment. The previous Sites hostname and sibling `agency` checkout are legacy; use this Cloudflare project for future website updates.

Korean uses locally hosted Noto Sans KR variable WOFF2 subsets with the included SIL OFL license, whole-word wrapping and responsive heading/spacing rules. All 187 copy entries, metadata and accessibility/media labels are localized. Root and `/en/` remain English; language codes and public route names stay separate.

## SEO crawl files

The build generates `sitemap.xml` with the eight canonical language homepages and `robots.txt` with the sitemap URL. Both use the configured HTTPS site origin. The root English homepage stays accessible and canonicalizes to `/en/`, so it is not duplicated in the sitemap. Language alternatives remain in the HTML `hreflang` links.

Submit `https://hiwin-partners.com/sitemap.xml` to the domain property in Google Search Console after deployment. Submission does not guarantee indexing.

## GA4 measurement

The production hostname `hiwin-partners.com` uses GA4 measurement ID `G-TNJQEP3WWM` (web stream `hp main site`). The Google tag appears once on the root and all eight language pages. Other hostnames, including local and Cloudflare preview addresses, do not initialize this property.

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
- Content rules: every property is labelled as a featured selection, and the page says more properties and room types are available on request. Partner rates are never published; the rate sheet is sent on enquiry. Room data follows the 2027 rate sheet; access and facilities follow the property brochures and apartmenthotel11.com. Property photos in `assets/stays/` are 640×800 crops of the main photos on apartmenthotel11.com.

## Cache busting · October 7, 2026

Cloudflare serves CSS/JS with `cache-control: max-age=14400` (4 hours), so after a release a returning visitor could get new HTML with an old stylesheet. `build.py` appends `?v=<content hash>` to every `styles.css`, `script.js`, `page.js` and `analytics.js` reference in the built HTML, so a changed file always gets a new URL. No manual step is needed.
