# Altura

A life reset retreat in Costa Rica's Central Valley, where guests leave with their own Should running on their own laptop. Published with GitHub Pages at https://rodmjay.github.io/altura/.

- Copy lives in `i18n/en.json` and `i18n/es.json` (es-419, our own translation). The page template is `src/page.html`.
- Build: `node scripts/build.mjs` writes `index.html`, `es/index.html` and `404.html`. The build fails if a string is missing in either language.
- Design system: install the release tag outside this repo, then run `scripts/sync-design-system.sh` with `DS_COPY` set to its copy script; it refreshes `ds/` (should brand only) and `ds/VERSION`.
- Should screenshots in `img/should/` come from the public demo (made-up data).
- The sign-up posts to the same Google Form as before (field ids in `home.js`).
