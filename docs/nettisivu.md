# Nettisivu

> Tila 27.6. Sivu rakennettu **Wolverine Worldwiden visuaalisen kielen** pohjalle (ks. [designjarjestelma.md](designjarjestelma.md)).

## Stack

- **Yksi staattinen `index.html`** (ei build-vaihetta) + `wolv-comp.css` (Wolverinen oikea komponentti-CSS) + `hero.mp4` + `hero-poster.jpg` + `favicon.svg` + `og.png`.
- Fontit: Archivo + JetBrains Mono (Google Fonts).
- Liike: Lenis (CDN) + oma `is-inview`/parallax-shim.
- **Ei riippuvuuksia / framework.** Toimii avaamalla tiedoston tai kevyellä palvelimella.

## Hosting & deploy

- Repo: **`parkkonenjesse-alt/aijesse`** (GitHub, henkilökohtainen tili — EI Puddles).
- Vercel-tili **asdad / parkkonenjesse-alt**. Projektit:
  - **parkkonen.vercel.app** (kanoninen)
  - **tekoalykoulutus-web.vercel.app** (synkattu kopio)
- Deploy: push `main` → auto-deploy. Molemmat projektit pidetään synkassa.
- Paikallinen esikatselu: `npx live-server --port=5500` → http://localhost:5500 (hot reload). Huom: jos näkyy vanhentunutta, kova reload Cmd+Shift+R.

## Rakenne

### Etusivu (index.html, single-page scroller)
Hero (video) → Statement 1 → Standout-galaxy → Large-card → Statement 2 → Paketit (market-snapshot) → Esimerkit (karuselli) → Polku (timeline) → Push-CTA → Footer (+ sticky-kuva).

### Alasivut (27.6., perussivuston pakolliset sivut)
Mallina Wolverinen sisäsivurakenne: lyhyt **dark page-header-bändi** (`.x-page-header.ph.ph-hero`) → sisältösektiot Wolverinen komponenteilla → push-CTA → footer.

| Sivu | Sisältö |
|------|---------|
| `palvelut.html` | Mitä asiakas saa, kolme arvoa, esimerkit-karuselli |
| `hinnasto.html` | 3 hinnoittelukorttia (Startti/Rakennusjakso suosituin/Kumppani), mitä hintaan kuuluu |
| `prosessi.html` | 4 vaihetta (kartoitus→työpaja→käyttöönotto→jatko) |
| `tietoa.html` | Ydinlupaus, tekijä, miksi tarpeen (yritys-passiivi) |
| `yhteystiedot.html` | Sähköposti, sijainti, varaus-CTA |
| `ukk.html` | FAQ-accordion (natiivi details/summary) |
| `tietosuoja.html` | GDPR-tietosuojaseloste (TODO: Y-tunnus/nimi/evästeet) |

**Jaetut tiedostot:** `site.css` (alasivujen chrome + interiöörikomponentit, omat luokat prefiksi `x-`) ja `site.js` (sama motion/UI kuin indexin inline-JS). Etusivu pitää oman inline-tyylin/JS:n (toinen terminaali omistaa index.html:n).

**IA yhtenäistetty (27.6.):** koko sivuston päänavi (header + mobiili + footer) osoittaa alasivuihin (/palvelut /hinnasto /prosessi /tietoa /yhteystiedot). Etusivun header-CTA "Varaa keskustelu" → #yhteys (oma osio), alasivuilla → /yhteystiedot.html. Etusivun sisältösektiot säilyivät scrollerina. Lisätty `robots.txt`, `sitemap.xml`, `404.html`.

## TODO (prioriteettijärjestys)

1. **Oikeat valokuvat** placeholder-gradienttien (`.ph-*`) tilalle — suurin visuaalinen harppaus. Wolverine on ~90 % kuvavetoinen.
2. **Yrityksen nimi** placeholderin `[ yrityksen nimi ]` tilalle (nav + footer + meta-otsikot).
3. **Google Calendar -ajanvarauslinkki** → `BOOKING_URL`-vakio `index.html`:ssä (nyt tyhjä = `data-book`-napit vievät #yhteys-osioon / mailtoon). Luo Google Calendarissa *Appointment schedule*, kopioi `calendar.app.google/...`-linkki.
4. **Standout-galaxyn 3D-scroll-parallax** + porrastettu reveal (ks. STATUS.md).
5. Oma domain (esim. `.fi`) parkkonen.vercel.app:n tilalle.

## Koordinointi

KRIITTINEN: kaksi Claude-terminaalia ylikirjoitti toistensa työtä samassa `index.html`:ssä (26–27.6.). **Sääntö: vain yksi terminaali muokkaa `index.html`:ää kerrallaan**, tai eri terminaalit eri tiedostoihin. `git pull --rebase` ennen pushia. Ks. juuren `STATUS.md`.
