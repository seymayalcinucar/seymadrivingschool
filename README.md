# seymadrivingschool.com

Website for Seyma Driving School: automatic-only driving lessons with a DVSA Approved Driving
Instructor (ADI). Plain HTML and CSS in `site/`; no build step, no third-party requests.

## How it works

Every push to `main` runs `.github/workflows/pages.yml`, which uploads `site/` as it is and deploys
it to GitHub Pages.

## Local

```
python3 -m http.server -d site 8000
```

## Going live (one-off)

1. GitHub: create a public repo `AgileReleaseLtd/seymadrivingschool` (empty, no README), then
   `git push -u origin main`.
2. Repo → Settings → Pages → Source: **GitHub Actions**. Custom domain: `seymadrivingschool.com`.
   (With an Actions deploy the domain is set here; a `CNAME` file in `site/` would be ignored.)
3. Namecheap → Domain List → Manage → Advanced DNS. Delete the two parking records (the `www`
   CNAME to `parkingpage.namecheap.com` and the `@` URL Redirect), then add:
   - `@` A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `www` CNAME → `agilereleaseltd.github.io`
4. Once the DNS check in Settings → Pages turns green, tick **Enforce HTTPS**. `www` then redirects
   to the apex.
