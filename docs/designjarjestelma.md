# Design-järjestelmä

Tyylisuunta: **Swiss / International Typographic Style.** Grid, groteski, objektiivisuus, valkoinen tila, väri vain funktiolla. Musta/valkoinen pohja, mono-aksentit. Ei varjoja, ei koristeita (ympyröitä/glowja/blobeja), ei dekki-numerointia.

Nämä tokenit vastaavat `index.html`:n CSS-muuttujia. Päivitä molemmat yhdessä.

## Värit

| Token | Hex | Käyttö |
|-------|-----|--------|
| `--black` | `#0a0a0a` | Tummat osiot, footer |
| `--white` | `#f4f4f1` | Teksti tummalla, vaalea osio (cream) |
| `--ink` | `#111110` | Päämusta teksti vaalealla |
| `--paper` | `#ffffff` | Vaalea pohja |
| `--muted` | `#6b6b66` | Toissijainen teksti vaalealla |
| `--muted-dark` | `#8a8a85` | Toissijainen teksti tummalla |
| `--line` | `rgba(17,17,16,0.12)` | Hiusviivat vaalealla |
| `--line-dark` | `rgba(255,255,255,0.10)` | Hiusviivat tummalla |

Väriä ei käytetä koristeena. Korostus syntyy kontrastista (musta/valkoinen) ja tyhjästä tilasta.

## Typografia

- **Display & body:** Inter (400, 500, 600, 700). Isot otsikot lihavalla (700), tiivis kirjainväli (`-0.03…-0.038em`).
- **Utility / labelit:** JetBrains Mono (400, 500). Versaalit, väljä kirjainväli (`0.22em`), pieni koko. Käytä osion eyebrow-labeleihin ja teknisiin merkintöihin.
- Tyyppiskaala `clamp()`-pohjainen, responsiivinen.

## Layout

- Maksimi sisältöleveys 1600 px, keskitetty. Gutter `clamp(1.4rem, 1rem + 4vw, 6rem)`.
- Osiot pystyrytmillä `--space-section` `clamp(5rem, 4rem + 7vw, 12rem)`. Hero koko ruutu, muut luonnollinen korkeus.
- Tummat ja vaaleat osiot vuorottelevat "lukuina": tummat = väittämät (hero, ratkaisu, miksi minä, CTA), vaaleat = skannattava tieto.
- Grid-tekstuuri taustalla hienovaraisena (mask-fade), ei dominoi.

## Liike

- Scroll-reveal: pehmeä nousu + häivytys, `cubic-bezier(0.16, 1, 0.3, 1)`. Porrastus max 6 elementtiä.
- Navi kirkastuu (blur + paperitausta) kun scrollataan yli 40 px.
- Hover: napit nousevat 2 px, nuoli liukuu, chipit invertoituvat. Hillittyä.
- `prefers-reduced-motion`: kaikki liike pois.

## Kiellot

- Ei drop shadow / elevation.
- Ei koriste-elementtejä (ympyrät, glowt, blobit, partikkelit).
- Ei järjestysnumeroita UI:ssa.
- Ei em-dasheja teksteissä.
