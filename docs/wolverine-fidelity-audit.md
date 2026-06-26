# Wolverine-fidelity-audit — landing vs. oikea Wolverine-blueprint

Lähde: Firecrawl-kaapinta wolverineworldwide.com (2026-06-26). Verrattu `index.html`:n toteutukseen.

## Rakenteen mäppäys (1:1)

| Wolverine-sektio (blueprint) | aijesse-landing | Status |
|---|---|---|
| Hero "Make. Every Day. Better." | `c-hero-home` + glass-kortti | ✅ rakenne |
| "A portfolio built for every step" | `c-standout-image-galaxy` | 🔧 toinen terminaali (galaxy) |
| 2025 Annual Report / Many brands | `c-large-card` + statement | ✅ |
| Market Snapshot | `c-market-snapshot` (Paketit) | ✅ |
| Latest News / brand cards | `c-cards-carousel` (Esimerkit) | ✅ |
| Creating Your Future With Us | `c-push` CTA | ✅ |
| Footer | `c-footer*` | ✅ |

## Kuvasuhteet (verifioitu blueprintin transform-mitoista)

| Elementti | Wolverine | Landing nyt | Status |
|---|---|---|---|
| Kortit | 900×676 (1.33) | `aspect-ratio: 1.33` | ✅ täsmää |
| Large-card | 1000×1000 (1:1) | `sm:aspect-square` | ✅ täsmää |
| Hero / Push | 1920×AUTO full-bleed | full-bleed | ✅ |
| Portfolio-galaxy | 400×AUTO | (toinen terminaali) | 🔧 |

## Johtopäätös
Landing toteuttaa blueprintin jo uskollisesti. Scrape **vahvisti** fideliteetin; isoja aukkoja ei löytynyt. Sisältö on tarkoituksella suomalaista AI-konsulttisisältöä (ei Wolverine-copya).

## Avoimet deltat (STATUS.md TODO, ei blueprintista)
- Mobiilivalikko: CSS olemassa (rivit 58–68) — verifioi toiminta selaimessa.
- Header-napin kosketuskorkeus: `min-height: 44px` lisätty ✓.
- Standout-galaxy: toisen terminaalin työ — älä koske.

## Kuva-assetit referenssinä
42 uniikkia Wolverine-kuva-URLia mitoilla: `scratchpad/wolverine-blueprint.md`.
