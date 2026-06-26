# Design-järjestelmä

> Päivitetty 27.6. — nettisivu rakennettu **Wolverine Worldwiden visuaalisen kielen** pohjalle.
> (Aiempi Swiss-mustavalkoinen suunta hylätty.)

## Lähtökohta

Sivu käyttää **Wolverine Worldwiden oikeaa käännettyä CSS:ää** (`wolv-comp.css`) ja heidän oikeita komponenttiluokkiaan + animaatiomekanismiaan. Tämä antaa pikselitarkan komponentti-CSS:n (spacing, typo, radius, easet). Poikkeamat tästä ovat tarkoituksellisia substituutioita:
- **Fontti:** Archivo (ABC Diatype on lisensoitu) — override `--font-sans`/`--font-mono`.
- **Kuvat:** gradientti-placeholderit (`.ph-*`) — TODO: oikeat valokuvat.
- **Sisältö:** suomenkielinen, asiakaskeskeinen.

Tyylisuunta: **full-bleed valokuva/video + lasipaneelit, valkoinen sivu, iso groteski-display, kelluva pilleri-navi, scroll-vetoinen liike.**

## Väripaletti (Wolverine)

| Token | Hex | Käyttö |
|-------|-----|--------|
| `--color-black` | `#010101` | Teksti, tummat pinnat, footer, push |
| `--color-white` | `#ffffff` | Sivun pohja, teksti tummalla |
| `--color-gray-200` | `#cccccc` | Hiusviivat, disabloitu |
| `--color-gray-400` | `#9d9d9d` | Toissijainen |
| `--color-gray-500` | `#737373` | Leipäteksti-meta |
| `--color-gray-600` | `#757575` | Eyebrow / mono-labelit |
| `--color-gray-800` | `#4d4d4d` | Tumma harmaa |

Valkoinen sivu, musta teksti. Tummat pinnat (hero-kehys, push, footer) ovat full-bleed-osioita.

## Typografia

- **Display / heading / body:** Archivo (400–800). Display-otsikot paino **700**, `letter-spacing -0.05em`, `line-height 0.79–0.82`.
- **Mono-labelit / eyebrowt:** JetBrains Mono (400, 500), versaalit, ~11px, `letter-spacing 0.08–0.16em`.
- Type-skaala (Wolverinen clamp-arvot): `display-xl` ~168px, `display-lg`, `heading-md`, `heading-xs`, `heading-2xs`, `body-md`, `body-sm`, `label`.

## Komponentit (Wolverinen luokat)

- **`c-header`** — kelluva pilleri-navi: koko levyinen ylhäällä, kutistuu pilleriksi scrollatessa (`html.has-scrolled`), piiloutuu alas-scrollatessa / palaa ylös (`has-passed-fold` + `is-scrolling-down/up`).
- **`c-hero-home`** — full-bleed video (8px inset, 16–20px pyöristys), otsikko alavasen, lasikortti alaoikea (`c-hero-card`, 280px), scrim. Tekstit feidaa porrastetusti.
- **`c-button`** — bg-kerros (`c-button_bg`) + `scaleY(.94)`-squash + nuoli-swap (lead-ikoni sisään, label +25px, trail ulos). Variantit: `-white`, `-outline`, `-glass`, `-small`, `-unstyled`.
- **`c-text-two-columns`** — statement: otsikko + kappale + nappi, 12-col grid.
- **`c-standout-image-galaxy`** — porrastettu otsikko + siroteltu kuvagalaxy (`height:125svh`).
- **`c-large-card`** — musta paneeli, kuva vasen (aspect-square) + heading + glass-minikortti.
- **`c-market-snapshot`** — label vasen / data oikea, iso arvo (128px), mono-labelit, hiusviivat. (Sivulla = Paketit.)
- **`c-cards-carousel` / `c-card`** — kuva (aspect 1.33) + eyebrow + otsikko, vapaa scroll + drag + Edellinen/Seuraava. Ei snap.
- **`c-push`** — full-bleed parallax-tausta (scale 1.15→1.0 + translateY), keskitetty display + valkoinen pilleri.
- **`c-footer`** — logo + iso menu, sisältösarakkeet, alapalkki + sticky parallax-kuva (scale 1.3→1.1).

## Liike

- **Lenis** smooth scroll (`duration 1.2`, expo-out).
- **Reveal:** `anim-fade` (.6s power2-out), `anim-up` / `anim-up-scale` (.8s expo-out), `anim-fade-scale` (.6s), `anim-text` (rivi riviltä, 1s, --index×0.1s stagger). Trigger `is-inview` kun ~15% viewportissa (`data-scroll-offset="15%,0%"`, shim `rootMargin -15%`).
- **Parallax:** `data-scroll-css-progress` → `--progress` (push + footer-kuva).
- **Page-load:** valkoinen peite feidaa pois.
- **Easet:** `--ease-expo-out cubic-bezier(.19,1,.22,1)`, `--ease-power2-out (.215,.61,.355,1)`, `--ease-power4-out (.23,1,.32,1)`.
- `prefers-reduced-motion`: reveal heti, Lenis pois.

## Radiukset

`4 / 6 / 8 / 10 / 12 / 16 / 20px` (`--radius-2xs … 2xl`). Lasi-blur `18px`.

## Suurin jäljellä oleva harppaus

**Oikeat valokuvat** gradientti-placeholderien tilalle. Wolverine on ~90 % valokuvavetoinen; tämä on suurin visuaalinen ero. Pudota kuvat `.ph-*` / `.c-image_inner` -paikkoihin.
