# Graph Report - linkedin-carousels  (2026-10-13)

## Corpus Check
- Corpus is ~2,213 words - fits in a single context window. You may not need a graph.

## Summary
- 55 nodes · 67 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.83)
- Token cost: 63,028 input · 0 output

## Community Hubs (Navigation)
- Package Manifest
- Build Script Setup
- React Hooks Content
- Carousel Build Pipeline
- Slide Rendering Helpers
- Dev Dependencies
- Post Slide Data
- Post Discovery

## God Nodes (most connected - your core abstractions)
1. `Post 01: useState vs useReducer` - 7 edges
2. `Build Pipeline (npm run build -> PNG slides + PDF)` - 6 edges
3. `esc()` - 5 edges
4. `block()` - 5 edges
5. `renderSlide()` - 5 edges
6. `inline()` - 4 edges
7. `slides.mjs (post content)` - 4 edges
8. `scripts` - 3 edges
9. `codeBlock()` - 3 edges
10. `findPosts()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `caption.md (post text)` --references--> `Post 01: useState vs useReducer`  [EXTRACTED]
  README.md → posts/react-hooks/01-usestate-vs-usereducer/caption.md
- `Post 01: useState vs useReducer` --references--> `Post 02: useEffect (planned)`  [EXTRACTED]
  posts/react-hooks/01-usestate-vs-usereducer/caption.md → README.md
- `Post 01: useState vs useReducer` --references--> `React Hooks Series`  [EXTRACTED]
  posts/react-hooks/01-usestate-vs-usereducer/caption.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Carousel build inputs (content, config, theme -> slides/PDF)** — readme_build_pipeline, readme_slides_mjs, readme_caption_md, readme_config_mjs, readme_template_styles_css [INFERRED 0.85]
- **React state management choice (useState vs useReducer)** — posts_react_hooks_01_usestate_vs_usereducer_caption_usestate, posts_react_hooks_01_usestate_vs_usereducer_caption_usereducer, posts_react_hooks_01_usestate_vs_usereducer_caption_rule_of_thumb, posts_react_hooks_01_usestate_vs_usereducer_caption_state_snapshot [EXTRACTED 1.00]

## Communities (8 total, 2 thin omitted)

### Community 0 - "Package Manifest"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, preview, type, @fontsource/inter, @fontsource/jetbrains-mono (+2 more)

### Community 1 - "Build Script Setup"
Cohesion: 0.20
Nodes (4): args, htmlOnly, ROOT, targets

### Community 2 - "React Hooks Content"
Cohesion: 0.27
Nodes (9): Post 01: useState vs useReducer, react.dev/reference/react/useReducer, State Is a Snapshot (gotcha), useReducer, useState, caption.md (post text), LinkedIn Carousels, React Hooks Series (+1 more)

### Community 3 - "Carousel Build Pipeline"
Cohesion: 0.25
Nodes (8): Build Pipeline (npm run build -> PNG slides + PDF), config.mjs (name/handle, theme, slide size), Inline Markup (code, bold, cyan, violet, line break), PDF Output (LinkedIn document post), PNG Slides 1080x1350, Slide Block Types (lead, text, code, list, defs, note, rule, table, cols, steps, html), slides.mjs (post content), template/styles.css (theme CSS variables)

### Community 4 - "Slide Rendering Helpers"
Cohesion: 0.60
Nodes (6): block(), codeBlock(), esc(), inline(), kicker(), renderSlide()

### Community 5 - "Dev Dependencies"
Cohesion: 0.40
Nodes (5): devDependencies, @fontsource/inter, @fontsource/jetbrains-mono, playwright, shiki

## Knowledge Gaps
- **9 isolated node(s):** `@fontsource/inter`, `@fontsource/jetbrains-mono`, `PDF Output (LinkedIn document post)`, `PNG Slides 1080x1350`, `caption.md (post text)` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 30 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `playwright` connect `Package Manifest` to `Build Script Setup`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Build Pipeline (npm run build -> PNG slides + PDF)` (e.g. with `config.mjs (name/handle, theme, slide size)` and `slides.mjs (post content)`) actually correct?**
  _`Build Pipeline (npm run build -> PNG slides + PDF)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@fontsource/inter`, `@fontsource/jetbrains-mono`, `PDF Output (LinkedIn document post)` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `shiki` connect `Package Manifest` to `Build Script Setup`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package Manifest`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._