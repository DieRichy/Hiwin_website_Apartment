# HIWIN Travel Agency Partnerships

Static website with 7 languages, prepared for migration from Sites version 17.

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
