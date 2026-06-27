# Wolverine-liikespeksi (lähdetasolta, ei arvauksia)

> Tehty lukemalla Wolverinen oikeat tuotantotiedostot (`/dist/*.js` + `/dist/main-*.css`) ja kaappaamalla 150 freimiä livestä (2026-06-27). Jokainen arvo on lähteestä. Tämä on totuuden lähde sivuston liikkeelle. **ÄLÄ arvaa liikearvoja — päivitä tänne lähteestä.**

## Liikepino (mitä kirjastoja Wolverine käyttää)

| Kerros | Kirjasto / moduuli | Lähde |
|--------|--------------------|-------|
| Smooth scroll | **Lenis** (käärittynä `Scroll-Oyywjts5.js`) | `.lenis`-luokat CSS:ssä, 34× lenis JS:ssä |
| Animaatiot | **GSAP** (`index-5B9hMlRm.js`) + **SplitText** (`SplitText-B_sAOQpb.js`) | `gsap` 10×, `SplitText` |
| Reveal-trigger | **IntersectionObserver** (Scroll-moottorissa) | rootMargin, `is-inview` |
| Komponentit | omat custom elementit: HeroHome, StandoutImageGalaxy, Particles, Carousel, InlineVideo | `/dist/*.js` |

**EI Locomotive Scrollia. EI `data-scroll-speed`-parallaxia** (0 kpl oikeassa HTML:ssä). Aiempi oletukseni globaalista speed-parallaxista oli väärä ja poistettu.

## Lenis-asetukset (lähteestä)

- `easing: t => Math.min(1, 1.001 - Math.pow(2, -10*t))` (sama kuin meidän `site.js`/`index.html` jo käyttää)
- `smoothWheel: true`, `syncTouch: false`, `syncTouchLerp: .075`, `touchInertiaMultiplier: 35`
- duration Lenis-oletus (~1.2). Meillä `duration: 1.2`. **Vastaa.**

## Scroll-store ja header-tila (`scroll-B-NtrwPX.js`, `main.js`)

- `has-scrolled` = scroll **> 40px** (ei 10)
- `has-passed-fold` = scroll **> koko viewport-korkeus** (ei 0.85×)
- `is-scrolling-up/down` = suunta ±1
- `has-reached-footer` = `footerInView`-event
- mobiiliraja = `min-width: 700px`
- `--vw` asetetaan `clientWidth`:iin resize-tapahtumassa

**Korjattu meillä:** has-scrolled 40, has-passed-fold full vh (site.js + index.html).

## Reveal-järjestelmä (`anim-*` + `is-inview`)

- IntersectionObserver, oletus-rootMargin `-1px -1px -1px -1px`, per-elementti trigger-rootMargin `data-scroll-offset`-attribuutista (esim. `"15%,0%"` → -15% bottom).
- Lisää luokan `is-inview` (tai `[data-anim-parent].is-inview`-vanhemman kautta lapsiin).
- Tokenit (CSS): durations fast `.2` / base `.4` / slow `.6` / slower `.8` / slowest `1s`. Easet: power2-out `(.215,.61,.355,1)`, power3-out `(.165,.84,.44,1)`, power4-out `(.23,1,.32,1)`, expo-out `(.19,1,.22,1)`, sine-out `(.39,.575,.565,1)`.
- Reveal-luokat (initial → is-inview):
  - `anim-fade` opacity 0→1 (slow, power2-out)
  - `anim-up` translateY 20%→0 + opacity (slower, expo-out)
  - `anim-up-scale` translate3d(0,20%,0) scale(.9)→0/1 (slower, expo-out)
  - `anim-fade-scale` scale(.95)→1 + opacity (slow, power2-out)
  - `anim-scale-x` scaleX(0)→1 origin 0 (slower) — hiusviivat/jakajat
  - `anim-scale-y` scaleY(0)→1 origin top (slower)
  - `anim-text` SplitText `task:"lines", linesClass:"anim-text-item"`; rivi translateY(110%)→0 (mask), stagger `--index × 0.1s`, expo-out, slowest

**Meillä:** IO + `--progress` + SplitText-rivijako toteutettu samalla mekanismilla ja samoilla tokeneilla. `anim-scale-x/y` saatavilla mutta ei vielä käytössä missään (mahd. jatkokäyttö hiusviivoille).

## Hero-intro (`HeroHome-CZIa6_lW.js`) — GSAP-timeline, ease `expo.out`

Tarkat fromTo-arvot (työpöytä, ensilataus, rikkain haara):
- **tausta**: `{opacity:0, scale:.6, yPercent:20, borderRadius:12px}` → `{opacity:1, scale:1, yPercent:0, borderRadius:0, duration:1.2}`
- **video**: `{scale:1.15}` → `{scale:1}` samanaikaisesti (`"<"`)
- **otsikko (SplitText-rivit)**: `{opacity:0, yPercent:40}` → `{opacity:1, yPercent:0, duration:.8, stagger:.1}` offsetilla (`"<+0.4"`/`"<+0.6"`)
- **kortti**: `{opacity:0, scale:.9, yPercent:10}` → `{opacity:1, scale:1, yPercent:0, duration:.8}` (`"<+0.2"`)
- reduced-motion → intro ohi.

**Toteutettu meillä** CSS-keyframeina samoilla arvoilla (`heroBgIn/heroVideoIn/heroLineIn/heroCardIn`, expo-out, 1.2/1.2/.8/.8s, stagger ~.1 `--hd`-viiveillä). Verifioitu freimein.

## StandoutImageGalaxy (`StandoutImageGalaxy-B2el79Mz.js`)

- SplitText **sanoiksi**: `type:"words", wordsClass:"word", autoSplit:true`.
- Per sana i: offset-kuvio `[{-40,0},{0,-40},{0,40},{40,0},{0,-40},{0,40}]` → `--tx/--ty`; `--delay = i*0.1s`.
- CSS `.word`: opacity 0 + `translate(--tx,--ty)` → `.c-standout-image-galaxy_inner.is-inview .word` opacity 1 + translate 0; opacity slow/sine-out, transform slowest/expo-out, viive `--delay`.

**Toteutettu meillä** tarkalleen (offset-kuvio + delay i*0.1). Verifioitu.

## Particles (`Particles-0BM77DBr.js`) — JATKUVA scroll-velocity-parallax (EI vielä toteutettu)

Tämä on Wolverinen "elävin" komponentti (kelluvat kuvat syvyydellä galaxy-osiossa). Tarkka konfig lähteestä:
- 32 partikkelia. Asema: `x` 0–95 %, `y` 0–100 % satunnainen.
- z-arvot (syvyys, px): `[-200,-150,-100,-50,0,50,100,150,200]` (kierto).
- nopeuskertoimet: `[.8,.9,1,1.1,1.2]` (kierto).
- config: `speed:.15, ease:.1, scaleEase:.25, scrollMultiplier:.05, scaleMin:.5, scaleMax:1.4`.
- Logiikka: scrollin `velocity * scrollMultiplier` lisää targetiin; `current` lerppaa targettiin (ease .1); per partikkeli `position = -current*speed - extra`; `transform: translate3d(0, position px, z px) scale(s)`; skaala interpoloidaan position/containerHeight:stä välille .5–1.4 (scaleEase .25); jatkuva looppaus (wrap kun ennen/jälkeen containeria); ajetaan `gsap.ticker`-loopissa; scroll-suunta vaihtaa driftin suunnan.

**Status:** galaxy/Particles on **toisen terminaalin alue** (ks. STATUS.md). Tässä on sen tarkka spec toteutusta varten. Meidän nykyinen `galaxy-scatter` = staattiset kuvat kerta-revealilla.

## Carousel / InlineVideo

- Carousel (`Carousel-BQ8YF4PF.js`): drag + nuolet, GSAP-pohjainen. Meillä natiivi scrollLeft-versio (toimiva, ei identtinen mutta funktionaalisesti vastaava).
- InlineVideo: lazy-play. Meillä hero-video autoplay/muted/loop.

## Yhteenveto: mitä meillä on faithfullisti vs. mitä puuttuu

| Liike | Tila |
|-------|------|
| Lenis smooth scroll (easing, duration) | ✅ identtinen |
| Reveal-järjestelmä (anim-*, is-inview, tokenit) | ✅ sama mekanismi+arvot |
| anim-text rivijako + stagger | ✅ |
| `--progress`-parallax (push + footer) | ✅ |
| Header-tilakone (kynnykset 40 / full vh) | ✅ korjattu |
| Hero-intro (tausta/video/rivit/kortti) | ✅ toteutettu tarkoilla arvoilla |
| StandoutImageGalaxy sanareveal (±40, delay i*0.1) | ✅ toteutettu |
| **Particles jatkuva velocity-parallax** | ⛔ puuttuu (toisen terminaalin galaxy-työ; spec yllä) |
| anim-scale-x/y hiusviivoille | ⚪ saatavilla, ei vielä käytössä |
| Oikeat valokuvat (Wolverine ~90 % kuvavetoinen) | ⛔ placeholderit (eri TODO) |
