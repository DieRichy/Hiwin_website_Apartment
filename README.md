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

- `/<lang>/contact/` (`pages/contact.html`) lists every channel: one QR card per app, WhatsApp and LINE for +81 70-3205-9967 plus WeChat (tap on a phone, scan from a computer), side by side on wide screens, then email, phone and the office address. Wide screens show the three groups side by side; phones show one group at a time under WhatsApp / LINE / WeChat tabs (`page.js`), opening on LINE for Japanese, Traditional Chinese and Thai and on WhatsApp otherwise. It has no contact panel and no dock, since it is the page both point to.
- The one-stop support dock (`pages/_support.html`, `support.js`) sits bottom right on every other page and links to the contact page in the current language. It opens with its label (“One-stop support / Contact us”) on all screen sizes; visitors can minimise it to a small button, and the choice is kept in `localStorage`. It stays hidden while the contact panel is in view and while it would cover the homepage hero's bottom strip: on wide screens while the hero fills the screen, on phones until the first scroll moves the direct-booking link up. The back-to-top button sits above it.
- The contact panel on every page is a stack of labelled blocks: TEL (the big phone number), Email, the QR codes (label "Messaging apps · Scan to chat"; each language uses its usual term, e.g. 通訊軟體, メッセージアプリ, 메신저, aplikasi pemesejan) and the company address. Chat apps are one row of QR codes: WhatsApp and LINE for +81 70-3205-9967, and WeChat. The +81 70-5669-8688 accounts were removed from the site on 2026-10-10 (their QR files remain in `assets/qr/` and `tools/qr.py`). Chat links use `wa.me/<number>` and the LINE `ti/p` links; the QR codes hold the links each account's own QR shows.
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
- Contact panel (every page): under the heading, one line with the reply time (usually within 2 hours during business hours) and the staff languages (Japanese, Chinese, English, Korean), `.contact-reply`. The contact page also says what to send for a quote (stay dates, guests, rooms), which the partnership page booking steps repeat.
- Traditional Chinese wording: the brand type is 公寓式飯店 (as in the brochure); otherwise say 住宿 (accommodation), 館 for one building (心齋橋9號館, 60 多館) and 館別 for "which property". Never 物業, which reads as real estate in Taiwan, and not plain 飯店, which suggests a full-service hotel with a front desk.
- Back-to-top button (`pages/_support.html`, `support.js`): bottom right on every page except the short contact page (on wide screens just above the dock), in the dock's ink-and-gold style. It appears after the first screen and scrolls smoothly to the top (instantly when the visitor prefers reduced motion).
- Hero key facts (`.hero-points`): 60+ properties across Japan, rooms for 2–8 guests, breakfast delivery, partner rates on request. The header's "Partner with us" is a filled gold button on wide screens.
- Both header logos go to the homepage. The Apartment Hotel 11 logo is a mouse/touch shortcut (`tabindex="-1"`, `aria-hidden`), so keyboard and screen-reader users get one home link, the HIWIN logo.

## Photos from the HIWIN folder · October 10, 2026

Source: `/Users/frankdzzz/Documents/HIWIN/` (饮食部, 车队, 房间细节). Exported with `ImageOps.fit` to web sizes, JPEG quality 70–80, no EXIF (location data removed). Rule: each photo appears once on the site; photos that match ones already on the site are not added.

- Homepage carousel (`assets/property-*.jpg`, 640×960): straight-on, grand, newer buildings only (user rules). Namba Minami 4 (night), Kobe Motomachi, Shin-Imamiya 3, Tokyo Asakusa 2, Namba Minami 5, Nagoya Sakae, Shinsekai, Dotonbori 4. Shin-Imamiya 3, Namba Minami 5 and Dotonbori 4 were taken out of the Osaka page building strip (now 15 buildings) so no photo appears twice. Angled or small buildings (Kyoto Yasaka and Gion, Shinsaibashi 3, Ebisu, Abeno, Miyakojima) are not used. Other-city photos link to `osaka-accommodation/#other-cities`.
- Beyond accommodation thumbnails: `service-fleet.jpg` (company minivan) and `dining-crab.jpg` (448×336). The 鉄板焼 煌 photo stays only in the phone hero slideshow.
- Contact panel photo: stays the handshake photo (`partnership.jpg`). The Shinsaibashi 9 sign, the chauffeur line-up, the Kansai Airport entrance and the restaurant counter were tried and rejected (crop or topic).
- Osaka page "In-room facilities" row (`assets/facilities/`, 800×600): kitchen, washing machine and washbasin, bathroom, toilet, suite dining area for 8, with "Facilities vary by property".
- Unused photos were deleted from `assets/` (they remain in git history).
- Phone hero slideshow: Osaka city view at dusk (`mobile-city.jpg`, the first frame of `hiwin-hero.m4v`, 960×540), then the Shinsaibashi 9 exterior and the 鉄板焼 煌 dish; no guest-room interiors. The desktop hero is unchanged.
- Osaka page "In-room facilities": three across on tablets and phones so all five photos show without swiping.
- Beyond accommodation thumbnails are 168×126 (140×105 on tablets, 104×78 on phones). The relax and nightlife photos (`service-spa.jpg`, `service-nightlife.jpg`; new file names so browsers do not show cached old images) are recropped from the brochure page image (`HIWIN_Brochure_TW_Taiwan_Optimized.pptx`, ppt/media/image4.png) at about twice the old resolution, without the brochure text.

## Readability · October 10, 2026

- Text sizes from 11px to 17px were raised by 1px across `styles.css` (headings 18px and up unchanged).
- Small gold text (eyebrows, "Featured room type", room-type counts, ※ marks, arrows) uses `--gold-text: #86642a` (5.4:1 on white, 4.9:1 on cream). The brand gold `#a47c38` (3.8:1) stays for lines, borders and large numbers.
- Hero key facts keep the original layout (small square before each, no background box), all in white bold text with a soft shadow: 17px on computers, 15px on phones.
- Stats labels are short so they fit narrow phones: "Cities" (was "City destinations"); Malay "Properties" is "Penginapan".
- Hero heading is localized per market rather than translated word for word: EN "Your trips. Our stays.", zh-Hant 您規劃旅程，住宿交給我們。, ja 企画は御社に、滞在は私たちに。, ko 여행 기획은 귀사가, 숙박은 저희가 맡습니다., th "…เรื่องที่พักให้เราดูแล", ms "Anda rancang perjalanan. Kami uruskan penginapan.", id "Anda rancang perjalanan. Kami urus penginapan.", fil "Kayo ang magplano. Kami ang bahala." (kept). The zh-Hant subtitle reads 配合您規劃的行程… so it does not read as "the trip we plan for you".
- On phones the hero heading is always two lines: Korean, Thai, Filipino, Malay and Indonesian use smaller sizes that scale with the screen width (checked at 320–430px). All languages share the same hero overlay (the extra darkening once used for Thai, Indonesian, Filipino and Korean is gone).

## Twelve travel-agency properties, map, Simplified Chinese · October 26, 2026

- Source: the 12 property fact sheets `N_<館名>｜台灣繁體中文版.pdf` in the Drive folder HIWIN 物業資料 (1 難波南5, 2 心齋橋9, 3 通天閣, 4 心齋橋5, 5 宮古島, 6 黑門8, 7 新今宮3, 8 難波南3, 9 新今宮1, 10 難波2, 11 黑門4, 12 關西機場; uploaded October 15–21, 2026). Only the visible text counts: several sheets carry a hidden "自助入住…不提供早餐" layer under the check-in box, which is not used. Where the fact sheet and the rate sheet differ (Namba 2: 30㎡ and 84 rooms vs 25㎡ and 56 four-person rooms), the fact sheet wins.
- Osaka page (`pages/osaka-accommodation.html`): a sticky area navigation under the header (`.op-areanav`: Map + the six areas); 01 a map of the ten central Osaka properties (`.op-map`): the base image `assets/map-osaka.webp` is stitched from 国土地理院 淡色地図 tiles (cyberjapandata.gsi.go.jp/xyz/pale, zoom 16; credit "地理院タイル" shown under the map), pins are geocoded with the GSI address search (msearch.gsi.go.jp) and placed as percent-positioned links that jump to the property cards (`id="p-<slug>"`), with a numbered legend beside the map and Kansai Airport / Miyakojima as notes; 02 the building strip, then one card per property by area, now including Miyakojima, Okinawa (`assets/rooms/miyakojima.jpg`, the Family Room photo from the fact sheet). Each card: photo, "Pictured · <room type>", name, an "Open in Google Maps" link (Japanese address query), total rooms, every room type (size · beds · max guests · count, `.op-types`) and access lines. The first version had a separate overview table above the map; the user found it a duplicate of the cards, so the table was merged into the cards (2026-10-26; the `.op-table` CSS is still in styles.css, unused). Each Osaka area keeps a dashed "More properties in this area · Ask for more options" card after its featured buildings (the user wants agencies to know an area has more than the one or two shown); Okinawa left the "Other cities" chips because it is featured. The map heading names Osaka ("Ten Osaka properties within three kilometres.").
- Card data: "Total rooms" is the whole building; each room type shows its own count; room names follow the fact sheets' English (Standard Quadruple Room, Large Twin Room…). Kansai Airport check-in is 15:00–23:00 (the ※ footnote on both pages). The page was generated once from a data table (script kept outside the repo); the HTML is the source, so when a fact sheet changes, update the card and the partnership page figures (60–170 rooms per building; triple rooms with 3 single beds at 9 of 12) together.
- Partnership page order is now: 01 why partner → 02 group stays (room capacity 60–170, bed types) → 03 stay conditions → 04 how to book and FAQ (new question about separate beds) → 05 the brochure's four partnership models. Backgrounds alternate white / paper / cream.
- Simplified Chinese: locale `zh-Hans`, URL `/cn/`, menu label 简中 / 简体中文, `og:locale` zh_CN, individual travellers go to apartmenthotel11.com/zh-cn/, the contact page opens on the WeChat tab, font stack PingFang SC → Hiragino Sans GB → Microsoft YaHei. Every CSS rule that targeted `html[lang=zh-Hant]` now uses `html:is([lang=zh-Hant],[lang=zh-Hans])`. Wording differs from Traditional on purpose: 公寓式酒店 (not 飯店), 楼栋 for 館別 and 栋 for building counts, 协议价格 for partner rates, 咨询 / 联系 / 二维码 / 视频 / 旅游大巴 / 房态. The first pass was made from the Traditional text with a character map and word rules; edit both when a Chinese string changes. Submit the `/cn/` URLs in Search Console (the sitemap already lists them).
- English copy tightened: "Hotel convenience. The ease of home.", "Let's work together.", "Based in Osaka, with properties in six cities across Japan.", "Send an enquiry", "FIT (independent travellers)", "We match tour products, rates and room allocations to the way you sell." The translation keys were renamed with the text.
- Localization fixes: Malay says penginapan, never hartanah (real estate), and transfer / Bilangan tetamu; Korean uses 숙소 and 난바미나미 consistently and 픽업 차량; Thai uses บริษัทนำเที่ยว and โอกินาวา throughout; the graduation-trip term is the same in both places per language (ja 卒業旅行, ko 졸업 여행, id study tour); zh-Hant 精選館別 for the selection badge; `script.js` and `page.js` carry the new locale.
- Follow-up the same day (user): the properties page is no longer called "Osaka stays" because Miyakojima is on it — navigation and homepage card say "Our properties" (住宿一覽 / 宿泊施設一覧…), the links say "See all 12 properties", the page title and heading say "Apartment hotels for travel agencies across Japan" (user: the 12 are the sheets sent so far, not the whole offer — HIWIN has buildings all over Japan), so the copy calls them "12 featured properties", the overview chip is "Overview" and the badge "FEATURED SELECTION"; the URL stays `/osaka-accommodation/` so indexed links keep working. Namba 2 is 25㎡ for all three room types (the rate sheet's size; the fact sheet's 84-room total is kept). The Malay homepage drops the TONKATSU chip from the dining list (`build.py`, Malay only).
- Wording rule (user, 2026-10-26): never describe the featured 12 as "all" of anything (全部館別, 全施設, all 12, every property…) — the homepage says 60+ properties. Say "12 featured properties", "Overview", "details", "room types by property"; "not the full portfolio" in the selection note is the one place "全部" stays.
- Whole portfolio (same day): the user's sheet 物件資料 (Google Sheets 1DfZUNhq9Doi58fuG3OjfMfKKoI-awpP9-kPwQMneJuM; tabs 物件情報 = room types and totals per building, 物件場所 = addresses and coordinates) is the full list — the 12 fact sheets are only what was sent so far, and the user does not want every building listed ("暂时 12个PDF 就差不多"), only the page not to look small. So the page shows scale without names: small gold dots on the map for every other Osaka building with coordinates inside the map (32; heading "Our Osaka properties.", intro "HIWIN runs more than 50 buildings in Osaka"), each area's dashed card gives the real number of further buildings ("8 more buildings in this area → Ask for more options"), and the "More Osaka areas" chips list the sheet's areas that have no featured card above — Umeda, Tenma, Dotonbori, Nishinari, Abeno, Osaka Dome — with no counts (user: numbers invite adding up; areas already shown above are not repeated). The dots are 14px gold with a soft halo: visible, not loud (user: "不够明显 但是也要克制"). The data is in the generator's `portfolio.py` (names, areas, totals, coordinates — nothing from the sheet's revenue/OTA tabs); a full grouped list was built and then removed at the user's request. The sheet counts 54 Osaka buildings + Kansai Airport while the homepage chip says Osaka 52 (July 2026) — to reconcile when the user confirms.
- Google Maps links on the cards search the Japanese street address. A listing-name search ("Apartment Hotel 11 Shinsaibashi 9") was tried on 2026-10-26 and reverted the same day: it returned too many results (user). Desktop map column is up to 620px wide (740 was "太大了"); marker labels have no background, only a white halo (user).
- Map markers (same day, user: "标记著名景点和地标"): nine sights (Shinsaibashi-suji, Amerikamura, Dotonbori, Kuromon Market, Namba Parks, Namba Yasaka Shrine, Shinsekai, Tsutenkaku, Tennoji Zoo; gold diamonds) and six major stations (Shinsaibashi, Namba, Nankai Namba, Nipponbashi, Daikokucho, Shin-Imamiya; white rings) are HTML overlays (`.op-map-poi`, label side r/l/b) placed from coordinates in the generator's POI list, with localized labels (text nodes, so `build.py` translates them) and two legend samples. Label sides were chosen so nothing overlaps the numbered pins at 520px (desktop) and 343px (phone); check again after moving any marker.
- Marker look (same day, user: "换一个醒目的颜色 / 直观的 icon"): sights are red circles (#c4472f) with a camera, stations blue circles (#2b64b5) with a train; the icons are single-colour SVGs `assets/icons/camera.svg` and `train.svg` drawn through CSS masks like the chat icons, labels in matching dark red / dark blue. 18px on desktop, 15px on phones. Gold stays for HIWIN buildings (pins and dots), so the three kinds of marker read differently at a glance.
- Card collapse (same day, user: "客房卡片加一个收起来的操作 点击收起 默认打开"): every property card ends with a toggle (`.op-card-toggle`, `page.js`): collapsed by default (user: "默认收起"), the button reads "Show room types and access" (user wanted an inviting label, not "Expand") and "Collapse" when open; a link to a card (map pin, legend, `#p-<slug>`) opens it. It folds the room-type and access lists (`.op-card-detail`, a max-height transition — the grid-row trick was swapped out — none with reduced motion; note the hidden browser pane does not run CSS transitions, so test folds with transitions disabled) while the photo, pictured type, name, map link and total rooms stay. Cards now align to the top of their grid row (`.op-cards{align-items:start}`) so a folded card is simply shorter; the dashed "more" card still stretches. Labels are text nodes ("Collapse", "Expand") shown by aria-expanded, so the build translates them.
