# Jesse Parkkonen · Hands-on Tekoälykoulutus

Henkilökohtainen repository. Sisältää kaksi asiaa:

1. **Nettisivu** — `index.html` (staattinen sivu, deployataan Verceliin → [parkkonen.vercel.app](https://parkkonen.vercel.app))
2. **Yrityksen tietopankki** — `docs/`-kansion markdown-tiedostot: kaikki yrityksen tiedot, viestintä, palvelut, hinnoittelu ja design-järjestelmä yhdessä versioidussa paikassa.

Tietopankki on "sisältöallas": yksi totuuden lähde, josta nettisivun, myyntimateriaalien ja tarjousten sisältö johdetaan. Kun jokin muuttuu (esim. hinta), se päivitetään tänne ensin.

## Tietopankin sisällys

| Tiedosto | Sisältö |
|----------|---------|
| [docs/yleiskuva.md](docs/yleiskuva.md) | Mikä yritys on, missio, ydinlupaus |
| [docs/jesse.md](docs/jesse.md) | Kuka Jesse on, tausta |
| [docs/palvelut.md](docs/palvelut.md) | Palvelut ja mitä asiakas saa |
| [docs/hinnasto.md](docs/hinnasto.md) | Paketit ja hinnat |
| [docs/prosessi.md](docs/prosessi.md) | Miten toimeksianto etenee |
| [docs/kohderyhma.md](docs/kohderyhma.md) | Kenelle, ihanneasiakas |
| [docs/esimerkit.md](docs/esimerkit.md) | Esimerkit mitä asiakas voi rakentaa |
| [docs/brandi-ja-viestinta.md](docs/brandi-ja-viestinta.md) | Äänensävy, ydinviestit, sanasto |
| [docs/designjarjestelma.md](docs/designjarjestelma.md) | Värit, typografia, komponentit, liike (Wolverine-pohja) |
| [docs/nettisivu.md](docs/nettisivu.md) | Sivuston stack, hosting, rakenne, TODO, koordinointi |
| [docs/yhteystiedot.md](docs/yhteystiedot.md) | Yhteystiedot ja kanavat |
| [docs/myynti/](docs/myynti/) | Myyntikitti: viestit, keskustelurunko, vastaväitteet, tarjous, LinkedIn, FAQ |

## Nettisivu

Tyyli: **Wolverine Worldwiden visuaalinen kieli** — full-bleed valokuva/video, iso Archivo-display, kelluva pilleri-navi, lasipaneelit, scroll-vetoinen liike. Rakennettu Wolverinen oikealla CSS:llä (`wolv-comp.css`). Tarkat tokenit + komponentit: [docs/designjarjestelma.md](docs/designjarjestelma.md), tekninen tila: [docs/nettisivu.md](docs/nettisivu.md).

Live: **[parkkonen.vercel.app](https://parkkonen.vercel.app)** + tekoalykoulutus-web.vercel.app. Deploy: push `main` → Vercel auto-deploy.

Paikallinen esikatselu: `npx live-server --port=5500` → http://localhost:5500 (hot reload).

> **Koordinointi:** kaksi Claude-terminaalia muokkasi `index.html`:ää yhtä aikaa ja ylikirjoitti toistensa työtä. Sääntö: vain yksi terminaali muokkaa `index.html`:ää kerrallaan. Ks. `STATUS.md`.

## TODO

- [ ] **Oikeat valokuvat** placeholder-gradienttien tilalle (suurin visuaalinen harppaus)
- [ ] **Yrityksen nimi** placeholderin `[ yrityksen nimi ]` tilalle
- [ ] **Google Calendar -ajanvarauslinkki** `BOOKING_URL`-vakioon
- [ ] Yrityksen virallinen muoto + Y-tunnus, puhelinnumero, oma domain
