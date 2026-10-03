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
