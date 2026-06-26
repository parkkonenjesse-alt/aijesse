# Jesse Parkkonen · Hands-on Tekoälykoulutus

Henkilökohtainen repository. Sisältää kaksi asiaa:

1. **Nettisivu** — `index.html` (staattinen sivu, deployataan Verceliin → [aijesse-bay.vercel.app](https://aijesse-bay.vercel.app))
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
| [docs/designjarjestelma.md](docs/designjarjestelma.md) | Värit, typografia, layout-periaatteet |
| [docs/yhteystiedot.md](docs/yhteystiedot.md) | Yhteystiedot ja kanavat |

## Nettisivu

Tyyli: Swiss / International Typographic Style. Musta/valkoinen, Inter + JetBrains Mono, grid-tekstuuri, hiusviivat. Ei dekki-numerointia, ei varjoja, ei koristeita. Tarkat tokenit: [docs/designjarjestelma.md](docs/designjarjestelma.md).

Paikallinen esikatselu:

```bash
# avaa index.html selaimessa, tai aja kevyt palvelin:
python3 -m http.server 8000   # → http://localhost:8000
```

Deploy: push `main`-haaraan → Vercel rakentaa automaattisesti.

## TODO

- [ ] Yrityksen virallinen nimi ja Y-tunnus (jos toiminimi/oy perustetaan)
- [ ] Puhelinnumero ja mahdollinen erillinen domain
- [ ] Varauskalenterin linkki (esim. Cal.com) "Varaa keskustelu" -napille
