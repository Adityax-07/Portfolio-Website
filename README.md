# Aditya Bisht portfolio

Aditya Bisht's portfolio, adapted from the screenshot-based recreation of `heyprince.dev`. Built with plain HTML, CSS, and JavaScript.

## Run locally

From this directory:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173/`. The `dist/` directory contains the static deployable copy.

## Included

- Responsive single-page layout, dotted gutters, section navigation, and dark/light themes
- Inline SVG stickers, including draggable hero stickers
- Command menu (`Ctrl+K`), illustrative AgentBench trace inspector, and terminal-style contact form
- Scroll progress, active navigation, subtle section reveals, responsive hover details, and reduced-motion support
- Animated "From tokens to decisions" hero banner with cycling retrieval/reasoning/results emphasis
- Project concept panels, measured-impact strip, project jump index, and skill-domain cards
- Contact form opens the visitor's email client with the message filled in
- Resume download from `assets/aditya-bisht-resume.pdf`

The original sticker assets and portrait cutout were not available. The SVG stickers are recreations, and the portrait loads from Aditya's public GitHub profile. The AgentBench trace is an illustrative visualization, not captured runtime telemetry.

The separate [Demo-Portfolio](https://github.com/Adityax-07/Demo-Portfolio) checkout was used for design research and is excluded from this repository. See `REFERENCE_NOTES.md` for the patterns adapted into this site.
