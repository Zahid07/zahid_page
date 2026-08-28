# Muhammad Zahid — Portfolio

Next.js portfolio for [github.com/Zahid07](https://github.com/Zahid07). Glass UI, project write-ups in `explanations/`, and architecture flows in `public/flows/`.

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
3. Deploy. No env vars required.

## Content

| Path | Role |
| --- | --- |
| `explanations/*.md` | Project write-ups |
| `public/flows/*.html` | Interactive architecture flows |
| `src/lib/projects.ts` | Catalog (slug, stack, flow file) |
| `public/Muhammad_Zahid_Data_Engineer.pdf` | Resume |
