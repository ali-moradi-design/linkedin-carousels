# LinkedIn Carousels

React & Next.js carousel posts, rendered from code to PNG slides + a PDF (LinkedIn "document" posts use the PDF).

## Build

```bash
npm install
npm run build                                              # all posts
npm run build -- posts/react-hooks/01-usestate-vs-usereducer   # one post
```

Output goes to `posts/<series>/<post>/out/`:
- `<slug>.pdf` → upload this to LinkedIn (Add a document)
- `slide-XX.png` → 1080×1350 images, if you prefer an image post

The build warns when content overflows a slide.

## Add a new post

1. Copy a post folder, e.g. `posts/react-hooks/01-usestate-vs-usereducer`.
2. Edit `slides.mjs` (content) and `caption.md` (post text).
3. `npm run build`.

Slide blocks: `lead`, `text`, `code`, `list`, `defs`, `note`, `rule`, `table`, `cols`, `steps`, `html`.
Inline markup: `` `code` ``, `**bold**`, `==cyan==`, `~~violet~~`, `\n` line break.

Your name/handle, theme and slide size live in `config.mjs`. Theme colors are CSS variables in `template/styles.css` (`.slide[data-theme="green"]`) — change ~6 hex values to try a new palette.
Code samples are TypeScript (`lang: 'ts'` / default `tsx`). Kickers are uppercased automatically, except hook names like `useState`.

## Series

| # | Topic | Status |
|---|-------|--------|
| 01 | useState vs useReducer | ✅ |
| 02 | useEffect | ⏳ |
