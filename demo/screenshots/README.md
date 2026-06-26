# UI / UX Demo Screenshots

Reference screenshots captured from the Cypherpunk Code platform before the hosted site at cypherpunk-code.com was retired.

Use these images to understand layout, typography, and navigation when forking or redesigning the project.

## Desktop (1440×900)

| File | Page |
| --- | --- |
| `01-homepage.png` | Home — hero, featured resources, learning paths |
| `02-catalog.png` | Resource catalog with filters and CP Score |
| `03-paths.png` | Learning paths overview |
| `04-about.png` | About — mission, openness, stats |
| `05-resource-detail.png` | Single resource detail page |

## Mobile (390×844)

| File | Page |
| --- | --- |
| `06-mobile-home.png` | Home — mobile layout |
| `07-mobile-catalog.png` | Catalog — mobile filters |

## Regenerate

With the dev server running:

```bash
node scripts/capture-demo-screenshots.mjs http://localhost:3000
```