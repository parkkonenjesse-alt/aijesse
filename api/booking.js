// /api/booking.js — Vercel serverless-funktio (Node, zero-config)
// Ottaa vastaan ajanvarauksen, validoi serverillä, suojaa roskapostilta ja
// lähettää vahvistussähköpostit Resendin REST-API:lla (ei npm-riippuvuuksia).
//
// Env-muuttujat (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  (pakollinen jotta sähköposti lähtee; ilman tätä → 503, frontend putoaa mailtoon)
//   BOOKING_TO      (vastaanottaja; oletus parkkonen.jesse@gmail.com)
//   BOOKING_FROM    (Resendissä vahvistettu lähettäjä, esim. "Ajanvaraus <varaus@omadomain.fi>";
//                    oletus onboarding@resend.dev toimii vain omaan sähköpostiisi ennen domain-vahvistusta)
//
// TODO (vaativat omat tilisi/avaimet):
//   - Tallennus tietokantaan (Neon/Supabase): lisää INSERT tähän ennen sähköpostia.
//   - Automaattinen kalenterimerkintä (Google Calendar API service-account / Cal.com webhook).

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO = process.env.BOOKING_TO || 'parkkonen.jesse@gmail.com';
const FROM = process.env.BOOKING_FROM || 'Ajanvaraus <onboarding@resend.dev>';

const isEmail = (s) => typeof s === 'string' && /.+@.+\..+/.test(s);
const clean = (s, max = 500) => String(s == null ? '' : s).trim().slice(0, max);
const esc = (s) => clean(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

async function sendEmail(payload) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('Resend ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return r.json();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  const b = req.body && typeof req.body === 'object' ? req.body : {};

  // Roskapostisuoja: piilotettu honeypot-kenttä jonka botit täyttävät.
  if (clean(b.company)) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = clean(b.name, 120);
  const email = clean(b.email, 160);
  const date = clean(b.date, 80);
  const time = clean(b.time, 20);
  const note = clean(b.note, 1000);

  if (!name || !isEmail(email) || !date || !time) {
    res.status(400).json({ ok: false, error: 'validation' });
    return;
  }

  // Ilman avainta backend ei voi lähettää → frontend käyttää mailto-varareittiä.
  if (!RESEND_API_KEY) {
    res.status(503).json({ ok: false, error: 'not_configured' });
    return;
  }

  const when = date + ' klo ' + time;
  try {
    // 1) Ilmoitus hostille (sinulle)
    await sendEmail({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: 'Uusi ajanvaraus: ' + when + ' — ' + name,
      html:
        '<h2 style="font-family:sans-serif">Uusi ajanvaraus</h2>' +
        '<p style="font-family:sans-serif"><b>Aika:</b> ' + esc(when) + '<br>' +
        '<b>Nimi:</b> ' + esc(name) + '<br>' +
        '<b>Sähköposti:</b> ' + esc(email) + '</p>' +
        (note ? '<p style="font-family:sans-serif"><b>Viesti:</b><br>' + esc(note).replace(/\n/g, '<br>') + '</p>' : ''),
    });
    // 2) Vahvistus varaajalle — best-effort. Vaatii Resendissä vahvistetun domainin;
    //    ilman domainia tämä epäonnistuu hiljaa eikä kaada varauspyyntöä (host sai jo ilmoituksen).
    try {
      await sendEmail({
        from: FROM,
        to: [email],
        subject: 'Varausvahvistus: ' + when,
        html:
          '<p style="font-family:sans-serif">Kiitos ' + esc(name) + '!</p>' +
          '<p style="font-family:sans-serif">Varauspyyntösi on vastaanotettu: <b>' + esc(when) + '</b> (30 min keskustelu). Vahvistan ajan pian sähköpostitse.</p>' +
          '<p style="font-family:sans-serif">Terveisin,<br>Jesse Parkkonen</p>',
      });
    } catch (_) { /* domain ei vahvistettu vielä; ohitetaan */ }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
