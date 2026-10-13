# linkedin-carousels

LinkedIn carousel posts about React & Next.js, rendered from code (`npm run build`) to PNG slides + PDF. See README.md.

## Conventions
- Slide text in English, simple, based on the official docs (react.dev / nextjs.org).
- All code samples in TypeScript (`ts` / `tsx`).
- Kickers are uppercased automatically, but hook names (`useState`, ...) keep their casing.
- Theme: green (`config.mjs` → `theme`, colors in `template/styles.css`).
- Run `npm run build` and fix every overflow warning before committing.

## graphify
- This project uses graphify. The graph lives in `graphify-out/` (`GRAPH_REPORT.md`, `graph.json`, `graph.html`).
- Generated `posts/**/out/` folders are excluded (`graphify-out/.graphify_build.json`).
- After adding or changing posts, run `/graphify . --update`.
