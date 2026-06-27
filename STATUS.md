# STATUS — kahden terminaalin koordinointi

> Päivitä tämä kun teet ison muutoksen. Kaksi Claude-terminaalia rakentaa samaa repoa.
> **Git-säännöt:** `git pull --rebase` ENNEN pushia. Path-limited commit (`git commit index.html -m ...`). ÄLÄ ylikirjoita toisen työtä. ÄLÄ force-pushaa.

## Arkkitehtuuri (tärkeä)
Sivu on **uskollinen Wolverine Worldwide -replika** rakennettuna heidän **oikealla CSS:llään**:
- `wolv-comp.css` = Wolverinen oikea käännetty komponentti-CSS (`main-bTb3VakF.css`). Käytössä ~96 %. **ÄLÄ muokkaa tätä tiedostoa** — se on lähde. Override-tyylit menevät `index.html`:n `<style>`-blokkiin.
- `wolv-base.css` = POISTETTU käytöstä (oli pelkkää cookie-consent-CSS:ää, 0 käytössä). Tiedosto voi olla repossa mutta sitä EI linkitetä.
- DOM käyttää Wolverinen **oikeita luokkia**: `c-button`/`c-button_bg`/`c-button_inner`/`c-button_label`/`c-button_icon`, `display-xl`/`display-lg`/`heading-md`/`heading-xs`/`label`, `c-hero-home`/`c-hero-card`, `c-standout-image-galaxy`, `c-large-card`, `c-market-snapshot`, `c-card`/`c-card_inner`/`c-card_image`/`c-card_eyebrow`/`c-card_title`, `c-footer*`.
- **Fontti:** Archivo (Diatype lisensoitu) — override `--font-sans`/`--font-mono` `index.html`:ssä.
- **Kuvat:** gradientti-placeholderit (`.ph-1…6`, `.m-*`, `.ph-hero`, `.ph-push`). EI Wolverinen kuvia. Vaihda omiin valokuviin näihin paikkoihin.
- **Animaatiot:** oikea mekanismi — `anim-fade/anim-up/anim-up-scale/anim-fade-scale/anim-text` + `.is-inview`-trigger. JS-shim `index.html`:n lopussa lisää `is-inview`:n `[data-scroll]`-elementteihin (IntersectionObserver), tekee `anim-text`-rivijaon, **Lenis** smooth scroll, `--progress`-parallax (push+footer), header-tilaluokat `<html>`:ään (`has-scrolled`, `has-passed-fold`, `is-scrolling-down/up`), karuselli (drag + Edellinen/Seuraava).

## Sisältö & äänensävy
- **Äänensävy = suomen passiivi + asiakaskeskeisyys** ("istutaan, rakennetaan, käydään läpi", "tiimisi", "te/teidän"). EI "minä", EI teennäistä "me". Brändi/palvelu on subjekti, ei henkilö. Yritys (yksi tekijä).
- Yrityksen nimi = placeholder `[ yrityksen nimi ]` (ei päätetty).
- Sähköposti: parkkonen.jesse@gmail.com. Varauslinkki: `BOOKING_URL` (tyhjä = vie #yhteys-osioon; tähän Google Calendar -ajanvarauslinkki kun saadaan).

## Tehty
- Hero (full-bleed, glass-kortti), statement two-column, standout (porrastettu otsikko), large-card, Paketit (market-snapshot-layout), Esimerkit (kortti-karuselli), Polku, Push-CTA, Footer (+ sticky parallax-kuva-reveal).
- Bugikorjaukset: karuselli scrollLeft-pohjaiseksi, header-CTA valkoiseksi tummalla, logo nowrap, poistettu kuollut wolv-base.css, grain ilman mix-blendiä, reduced-motion-override, focus-visible, nav-aria-labelit, skip-link, id=main.

## Tunnetut bugit / TODO (vertailussa Wolverineen)
- Mobiilivalikko puuttuu (<1000px nav-linkit piilossa, ei hampurilaista). Footer-nav kattaa osittain.
- Header-napin kosketuskorkeus ~41px (<44px) mobiilissa.
- Käydään läpi lisää fidelity-eroja Wolverineen (button-hover-nuolianimaatio, kortti-leveydet, spacing, type-koot).

## Alasivut (27.6., parkkonen-terminaali) — UUSI
Sivusto sai perussivuston pakolliset alasivut, mallina Wolverinen sisäsivurakenne (lyhyt page-header-bändi → sisältösektiot → push-CTA → footer). EI kosketa `index.html`:ään.
- **Uudet:** `palvelut.html`, `hinnasto.html`, `prosessi.html`, `tietoa.html`, `yhteystiedot.html`, `ukk.html`, `tietosuoja.html`.
- **Jaetut:** `site.css` (alasivujen chrome + interiöörikomponentit, prefiksi `x-`), `site.js` (sama motion/UI kuin indexin inline-JS). Etusivu pitää oman inline-tyylin/JS:n.
- Sama `wolv-comp.css` + Wolverinen luokat + Archivo + dark page-header `.x-page-header.ph.ph-hero` + gradientti-placeholderit.
- Header valkoinen aina (site.css) koska alasivun yläbändi + scrollattu pilleri ovat tummia. Verifioitu Playwrightilla (200, ei konsolivirheitä, header näkyy top+scroll, 390/1440 responsiivinen).
- **TODO SINULLE (index.html):** päänavin IA-yhtenäistys. Etusivun navi = in-page-ankkurit (#ratkaisu/#esimerkit/#polku/#paketit), alasivujen navi = sivut (/palvelut.html /hinnasto.html /prosessi.html /tietoa.html /yhteystiedot.html). Päätetään yhtenäinen rakenne (joko etusivu scroller + alasivulinkit, tai etusivun navi → alasivut). `data-book` + `BOOKING_URL` toimivat samoin.

## Deploy
- Repo: `parkkonenjesse-alt/aijesse` → Vercel auto-deploy.
- Projektit: **parkkonen.vercel.app** + **tekoalykoulutus-web.vercel.app** (molemmat synkattu).
- Hot reload paikallisesti: `npx live-server --port=5500` → http://localhost:5500

## Motion-audit (27.6.) — TOISELLE TERMINAALILLE: standout-galaxy
Motion-agentit mittasivat: reveal/hover/Lenis/header = identtisiä Wolverinen kanssa. Korjattu (parkkonen-terminaali): push-parallax, footer-parallaxin valmistuminen, page-load-peite.

**JÄLJELLÄ sinun galaxy-osiossasi (suurin motion-harppaus):**
- Wolverinen scattered-kuvat ovat **jatkuva 3D-scroll-parallax**: jokainen `.g-img` `translate3d(0, <scroll-linkattu Y>, <translateZ −200…+200px>)` + `perspective` parentilla → syvyys-eriytetty drift scrollatessa. Sinun `.g-img` tekevät vain kerta-`anim-up-scale`-revealin ja jäävät staattisiksi (identity-matriisi joka scroll-Y:llä).
- Lisäksi kaikilla 12 kuvalla `--anim-delay:0s` → pop-paavat yhtä aikaa. Lisää nouseva `--anim-delay` (esim. .04s-portain) → porrastettu scatter-cascade.
- Korjaus: aja `.g-img`-translateY (+ translateZ-syvyystaso) scroll-progressista (perspective parentilla), älä kerta-reveal-luokasta.
