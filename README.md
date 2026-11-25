# PYXON.com

The website of PYXON. **Intelligence Built for Reality.**

PYXON-Eye is the contextual intelligence platform for governments and enterprises. This repository holds the complete static website: every page, the six languages, the films, the downloadable briefs and the redirects from the old addresses.

## Languages

English, Arabic (right to left), German, French, Spanish and Simplified Chinese. Visitors switch with the globe button in the header; a language can also be opened directly with `?lang=ar`, `?lang=de`, `?lang=fr`, `?lang=es` or `?lang=zh`.

## Run it locally

No build step and no server code. Serve the folder with any static server:

```
python -m http.server 8080
```

Then open http://localhost:8080. Any static host works: GitHub Pages, Azure Static Web Apps, Netlify, S3 and CloudFront, IIS.

## Structure

| Path | What it holds |
|---|---|
| `index.html` | Page shell: header, footer, PYXI guide, film viewer, search and sharing tags |
| `js/data.js` | All website copy in English: solutions, films, documents, legal pages |
| `js/app.js` | Pages, routing (`#platform`, `#gov-insight`, `#contact`...), scroll choreography |
| `js/i18n.js` | Language engine and switcher |
| `js/i18n-dict.js` | Every translation, keyed by the English text |
| `js/gap-scene.js` | The animated drawing for the deployment gap section |
| `css/site.css` | Design system: colours, Myriad Variable Concept and GE SS Two, layout |
| `assets/` | Loom film frames, films, images, fonts and downloadable PDFs |
| `about/`, `solutions/`, `privacy-policy/` and the other folders | Redirects from the old pyxon.com addresses to the new pages |

## Contact

info@pyxon.com · [pyxon.com](https://pyxon.com) · [LinkedIn](https://www.linkedin.com/company/pyxon)

© 2026 PYXON. All rights reserved.
