#!/usr/bin/env bash
# Adds a <lastmod> to every URL in site/sitemap.xml: the date of the last commit that changed that
# page. Bing and Google use it to decide what to read again, so it must be true; taking it from git
# means nobody has to remember to update it. The deploy runs this on its own copy (full history
# needed); the sitemap in the repo stays without dates. Run from the repo root.
set -euo pipefail

map=site/sitemap.xml
host=https://seymadrivingschool.com/

for loc in $(grep -o '<loc>[^<]*' "$map" | sed 's/<loc>//'); do
  path=${loc#"$host"}
  file=site/$path
  [[ -z $path || $file == */ ]] && file=${file}index.html
  [[ -f $file ]] || { echo "sitemap-dates: $loc has no file ($file)" >&2; exit 1; }
  date=$(git log -1 --format=%cs -- "$file")
  [[ -n $date ]] || { echo "sitemap-dates: no git history for $file" >&2; exit 1; }
  sed -i "s|<loc>$loc</loc></url>|<loc>$loc</loc><lastmod>$date</lastmod></url>|" "$map"
done

# Every URL must now have exactly one date.
[[ $(grep -c '<loc>' "$map") == $(grep -c '</loc><lastmod>[0-9-]*</lastmod></url>' "$map") ]] \
  || { echo "sitemap-dates: some URLs got no date" >&2; exit 1; }
