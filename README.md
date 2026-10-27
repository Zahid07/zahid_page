# Muhammad Zahid — Portfolio

Next.js portfolio for [github.com/Zahid07](https://github.com/Zahid07). Dark UI in the Plainjoin concept's style (Instrument Sans + JetBrains Mono, one orange accent) over an animated starfield. Every project has its own page with screenshots, a write-up in `explanations/`, and, where there is one, an architecture flow from `public/flows/`.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub

Create a repo, then:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/Zahid07/<repo>.git
git push -u origin main
```

## Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: Next.js. Build `next build`, output default.
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL (used for absolute share-card links), then deploy.

## Content

| Path | Role |
| --- | --- |
| `src/lib/projects.ts` | Catalog: slug, summary, stack, context, status, live links, screenshot captions |
| `explanations/<slug>.md` | Project write-up; each `## Heading` becomes a card on the project page |
| `public/shots/<slug>/*.png` | Screenshots, shown in file order (1.png is the card cover) |
| `public/flows/*.html` | Interactive architecture flows |
| `src/lib/site.ts` | Name, summary, experience and skills for the About page |
| `public/Muhammad_Zahid_Data_Engineer.pdf` | Resume |

## Screenshots

`node scripts/capture-screenshots.mjs` re-captures the live sites, the flows and the thesis prototype with headless Edge, and copies the existing images (Plainjoin concept, games, model agent). Add a project by adding a catalog entry, `explanations/<slug>.md`, and a line in the script, or drop PNGs into `public/shots/<slug>/` by hand.
