# seymadrivingschool.com

Website for Seyma Driving School: automatic-only driving lessons with a DVSA Approved Driving
Instructor (ADI). Plain HTML and CSS in `site/`; no build step, no third-party requests.

Colours and the car artwork (`site/img/car.png`) come from the school's own flyer. The image has a
flat `#0f3d3e` background, so it must sit on exactly that colour (`--brand` in `css/style.css`).
`site/og-image.png` (1200x630) is the preview shown when the link is shared.

## How it works

Every push to `main` runs `.github/workflows/pages.yml`, which uploads `site/` as it is and deploys
it to GitHub Pages.

## Turkish pages

`site/tr/` holds a Turkish copy of every page (`index.html`, `show-me-tell-me.html`,
`privacy.html`). Each page links to its counterpart from the header and footer and declares the pair
with `hreflang` tags, so when you change one page, change the other. `js/site.js` (the WhatsApp
message) and `js/consent.js` (the cookie banner) take their wording from `<html lang>`. The Turkish
letters ğ, ş and İ are in `css/fonts/plus-jakarta-sans-latin-ext.woff2`, which only pages that use
them download. In Turkish text her name is written Şeyma; the school's name stays Seyma Driving
School.

## Google rating

The rating and review count ("5.0 · 18 Google reviews") appear once on each home page, under the
headline, in `site/index.html` and `site/tr/index.html`. Update both when the count changes. Every
Google link visitors see goes to the business page in Maps
(`https://maps.google.com/?cid=1360433525445105890`); only `review.html` links to the write-a-review
form.

## The car

The safety features in the "The car" section come from Toyota's UK equipment list for the Corolla
Design grade and from Euro NCAP's 2019 test result. Change the list if the car changes.

## Lesson guide

`site/what-you-will-learn.html` and its Turkish copy `site/tr/derslerde-neler-ogrenilir.html` (a
Turkish file name) set out 26 of DVSA's learner skills in five stages: all but motorways, which
Seyma leaves out because they are not part of the practical test (the home page has no motorway
lessons card either, and turning the car around is marked as taught but not tested). The skills and the five progress
levels come from DVSA's "How to record your pupils' progress learning to drive and the skills they
need" (updated 7 February 2023); the test and theory test facts come from GOV.UK (checked 12 November
2026). Printed, or saved as a PDF, each page becomes four A4 pages of guide plus a one-page progress
checklist. The print layout is the `.guide-page` block in `css/style.css`, and the checklist table
only appears on paper. If DVSA changes the syllabus or the test, update the stage lists and the
checklist on both pages together, then print both to check nothing spills onto an extra page.

## To do

Open tasks are listed in `todo/todo.md`, with one file per task in `todo/items/`.

## Analytics

Google Analytics 4 (`G-Y35MRWPQNZ`, set in `site/js/consent.js`) is opt-in: nothing is loaded from
Google and no cookie is set until a visitor presses Accept on the cookie banner. The banner is a
slim bar that appears on the first scroll (or after six seconds), so it never covers the headline
and the WhatsApp and Call buttons when someone arrives. `site/privacy.html`
describes this, so keep the two in step. To switch Analytics off, remove the `consent.js` script
tags and the Analytics section of the privacy page.

## Search engines

Google Search Console and Bing Webmaster Tools are set up (to-do d-002, d-017). Search Console is
verified by a TXT record at Namecheap: keep it. `site/b573300efa4ee5182e1ef21f3611275b.txt` is the IndexNow key: keep it
too. After a change to the pages, tell Bing and the other IndexNow engines:

```
curl -s -X POST https://api.indexnow.org/indexnow -H 'Content-Type: application/json' \
  -d '{"host":"seymadrivingschool.com","key":"b573300efa4ee5182e1ef21f3611275b","urlList":["https://seymadrivingschool.com/"]}'
```

## Local

```
python3 -m http.server -d site 8000
```

## Going live (one-off)

1. GitHub: the repo is `seymayalcinucar/seymadrivingschool` (public). First push:
   `git push -u origin main`.
2. Repo → Settings → Pages → Source: **GitHub Actions**. Custom domain: `seymadrivingschool.com`.
   (With an Actions deploy the domain is set here; a `CNAME` file in `site/` would be ignored.)
3. Namecheap → Domain List → Manage → Advanced DNS. Delete the two parking records (the `www`
   CNAME to `parkingpage.namecheap.com` and the `@` URL Redirect), then add:
   - `@` A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `www` CNAME → `seymayalcinucar.github.io`
4. Once the DNS check in Settings → Pages turns green, tick **Enforce HTTPS**. `www` then redirects
   to the apex.
