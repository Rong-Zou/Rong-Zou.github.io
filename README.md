# Rong Zou Personal Website

This repository contains the source for <https://rong-zou.github.io/>.

The site is based on [PRISM](https://github.com/xyjoey/PRISM), a static-export Next.js template for academic personal websites. The old Jekyll/al-folio version is backed up on the `old-site` branch.

## Local Development

PRISM requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
npm run build
```

The static site is exported to `out/`.

## Content

Most editable content lives in `content/`:

- `config.toml` for site metadata, navigation, social links, and analytics placeholders.
- `bio.md`, `news.toml`, `publications.bib`, `experience.toml`, and `stats.toml` for the main pages.
- `stats.toml` for the live Stats page counters, placeholder birth date, cities, and milestones.

Analytics are intentionally off by default. Add a Cloudflare Web Analytics token to `analytics.cloudflare_token` and a MapMyVisitors embed URL to `analytics.mapmyvisitors_embed_url` when ready.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, builds the static site with Node 22, writes `out/.nojekyll`, and deploys `out/` to the `gh-pages` branch.
