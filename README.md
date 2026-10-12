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
them download.

## The car

The safety features in the "The car" section come from Toyota's UK equipment list for the Corolla
Design grade and from Euro NCAP's 2019 test result. Change the list if the car changes.

## To do

Open tasks are listed in `todo/todo.md`, with one file per task in `todo/items/`.

## Analytics

Google Analytics 4 (`G-Y35MRWPQNZ`, set in `site/js/consent.js`) is opt-in: nothing is loaded from
Google and no cookie is set until a visitor presses Accept on the cookie banner. `site/privacy.html`
describes this, so keep the two in step. To switch Analytics off, remove the `consent.js` script
tags and the Analytics section of the privacy page.

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
