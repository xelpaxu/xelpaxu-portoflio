# Project catalog sources

Six featured entries: Vecpro (Aedify + Aedex), VISAIA, VISAIA Dashboard, Amogus, enCast, Memowee.
All projects additionally includes NexaCare, Revia, Vertex Realty, CICTZONE, BigBrew POS.

## Evidence used

- Vecpro: local `C:/projects/vecpro/aedify` and `aedex` package manifests, application routes, reporting and mapping modules. No repository URL was invented; the separate `vecpro-web` site is not substituted for these applications.
- VISAIA: `C:/projects/visaia/PROJECT_SUMMARY.md`, pubspec and application files. Local origin: `kheypaxu/visaia`.
- VISAIA Dashboard: local `PROJECT_OVERVIEW.md`, package manifest, application routes. Local origin: `kheypaxu/visaia-dashboard`.
- Amogus: local frontend routes, game components, and Python game server. Local origin: `xelpaxu/amogus`.
- enCast: user-provided `Downloads/enCast.pdf`, especially pages 3-7 and 12-13. Flutter and Dart are confirmed in the PDF. The document specifies the chatbot; implementation was not verified. The user-supplied repository URL returned 404 through the current GitHub connection, so no backend stack or deployment is assumed.
- Memowee: public repository `xelpaxu/Memowee`, `memowee_backend.py` and `index.html`. Described as a prototype; no recognition-accuracy or medical claims.
- NexaCare: local requirements, patient and appointment models, and role dashboards. Local origin: `nicssskie/NexaCare`.
- Revia: local README, package manifest, and application code. Local origin: `nicssskie/Revia`. Demo URL comes from the README.
- Vertex Realty: local package manifest, router, property pages. Local origin: `xelpaxu/vertex-realty`.
- CICTZONE: local Pygame/Arcade implementations, A* pathfinding, and constraint placement. Local origin: `xelpaxu/cictzone`.
- BigBrew POS: public `xelpaxu/BIGBREW-POS` source, requirements, and views. Python/Flet confirmed.

## Assets and links

The SVG covers are original project artwork, clearly labeled in the interface. They are not screenshots or recordings of the applications. Replace paths in `images` and update `imageLabel` in the project data when approved screenshots are supplied.

Standard technology logos come from the installed Simple Icons package. Convex and Flet symbols are unmodified assets from their official brand resources:
- https://www.convex.dev/brand
- https://www.convex.dev/resources/logos.zip
- https://github.com/flet-dev/flet/blob/main/media/logo/logo-symbol.svg

Project entries use a neutral catalog status. No production uptime, live deployment, launch date, performance metric, or ownership beyond the local/source evidence is assumed. Source links may require repository access.

## Project detail content and demo actions

Extended detail content lives in `src/data/projects/case-studies.ts`. Each entry contains overview paragraphs, intended users, a goal, titled capabilities, a workflow, and technical notes. Keep these aligned with the project source; do not add unverified outcomes or metrics.

In `src/data/projects/projects.ts`:
- `github`: repository URL; shown as View on GitHub.
- `demo`: deployed application URL, or a YouTube URL. YouTube links automatically show Watch demo; deployed URLs show Live demo.
- `videoDemo`: optional separate walkthrough URL when both a live deployment and recording are available.

Missing or invalid URLs do not produce empty or disabled demo buttons. Matching video URLs are deduplicated. No YouTube links were invented for this update.

Project imagery uses a single `images` array. It accepts file paths or per-image metadata objects. The first item is the cover, one item renders statically, and multiple items enable the carousel. See `PROJECT-IMAGES.md`.
