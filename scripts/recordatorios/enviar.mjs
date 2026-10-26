// Envía un recordatorio por mail a cada persona con reunión MAÑANA (hora Argentina)
// y una copia a VideoCallShop. Lo ejecuta GitHub Actions todos los días.
//
// Variables (se cargan como "secrets" en GitHub):
//   SUPABASE_URL          https://xxxx.supabase.co
//   SUPABASE_SECRET_KEY   clave secreta (sb_secret_...) — SOLO acá, nunca en la web
//   GMAIL_USER            cuenta de Gmail que envía (ej: videocallshoppping@gmail.com)
//   GMAIL_APP_PASSWORD    "contraseña de aplicación" de esa cuenta (16 letras)
//   AVISO_COPIA           (opcional) mail que recibe la copia; por defecto GMAIL_USER
//   FECHA                 (opcional) AAAA-MM-DD para forzar otra fecha (pruebas)
//   DRY_RUN=1             (opcional) muestra los mails sin enviarlos ni marcar nada

import nodemailer from "nodemailer";

const TZ = "America/Argentina/Buenos_Aires";
const DURACION_MIN = 30;
const WHATSAPP = "5493412668558";
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
  "septiembre", "octubre", "noviembre", "diciembre"];

const env = (k, req = true) => {
  const v = (process.env[k] || "").trim();
  if (req && !v) throw new Error(`Falta la variable ${k}`);
  return v;
};

const DRY = env("DRY_RUN", false) === "1";
const SB_URL = env("SUPABASE_URL").replace(/\/$/, "");
const SB_KEY = env("SUPABASE_SECRET_KEY");
const GMAIL_USER = DRY ? env("GMAIL_USER", false) || "prueba@example.com" : env("GMAIL_USER");
const GMAIL_PASS = DRY ? "" : env("GMAIL_APP_PASSWORD");
const COPIA = env("AVISO_COPIA", false) || GMAIL_USER;

function mananaArgentina() {
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date()); // AAAA-MM-DD
  const [y, m, d] = hoy.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + 1));
  return t.toISOString().slice(0, 10);
}

function textoFecha(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[dt.getUTCDay()]} ${d} de ${MESES[m - 1]}`;
}

function headers(extra = {}) {
  const h = { apikey: SB_KEY, "Content-Type": "application/json", ...extra };
  // Las claves "legacy" (eyJ...) además van como Bearer
  if (SB_KEY.startsWith("eyJ")) h.Authorization = `Bearer ${SB_KEY}`;
  return h;
}

async function reunionesDe(fecha) {
  const url = `${SB_URL}/rest/v1/reuniones?select=id,fecha,hora,nombre,email,telefono,empresa` +
    `&fecha=eq.${fecha}&recordatorio_enviado=eq.false&order=hora.asc`;
  const r = await fetch(url, { headers: headers() });
  if (!r.ok) throw new Error(`Supabase respondió ${r.status}: ${await r.text()}`);
  return r.json();
}

async function marcarEnviado(id) {
  const r = await fetch(`${SB_URL}/rest/v1/reuniones?id=eq.${id}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({ recordatorio_enviado: true }),
  });
  if (!r.ok) throw new Error(`No se pudo marcar ${id}: ${r.status} ${await r.text()}`);
}

// Convierte un teléfono argentino como lo escribe la gente ("0341 15 512-3456",
// "+54 9 341 512 3456", "341 5123456") al formato de WhatsApp: 549 + área + número.
function telefonoWhatsApp(tel) {
  let d = String(tel || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) {
    d = d.slice(2);
    if (d.startsWith("9")) d = d.slice(1);
  }
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length === 12) {
    // sacar el "15" que va después del código de área (2, 3 o 4 dígitos)
    for (const i of [2, 3, 4]) {
      if (d.slice(i, i + 2) === "15") {
        d = d.slice(0, i) + d.slice(i + 2);
        break;
      }
    }
  }
  return d.length === 10 ? `549${d}` : d;
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function mailHtml(r, cuando, hora) {
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola! Tengo una reunión agendada el ${cuando} a las ${hora} h.`)}`;
  return `<!doctype html><html><body style="margin:0;background:#F2F7FB;font-family:Poppins,Arial,sans-serif;color:#0F1B2D">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F7FB;padding:32px 12px"><tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden">
    <tr><td style="background:#0F1B2D;padding:22px 28px;color:#ffffff;font-size:20px;font-weight:700">VideoCallShop</td></tr>
    <tr><td style="padding:28px">
      <p style="margin:0 0 8px;font-size:14px;color:#0f6fb0;font-weight:700;letter-spacing:.06em;text-transform:uppercase">Recordatorio</p>
      <h1 style="margin:0 0 16px;font-size:24px">¡Hola ${esc(r.nombre)}! Mañana nos vemos</h1>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#43536b">Te recordamos tu reunión con VideoCallShop:</p>
      <div style="background:#F2F7FB;border-left:5px solid #29D2AB;border-radius:10px;padding:16px 18px;font-size:18px;font-weight:700">
        ${esc(cuando)} · ${esc(hora)} h <span style="font-weight:400;color:#43536b;font-size:15px">(hora Argentina, ${DURACION_MIN} min)</span>
      </div>
      <p style="margin:18px 0 22px;font-size:15px;line-height:1.6;color:#43536b">Te enviamos el link de la videollamada por WhatsApp o por este mail. Si necesitás cambiar el horario, respondé este mail o escribinos.</p>
      <a href="${wa}" style="display:inline-block;background:#29D2AB;color:#0F1B2D;text-decoration:none;font-weight:700;padding:13px 24px;border-radius:999px">Escribinos por WhatsApp</a>
    </td></tr>
    <tr><td style="padding:16px 28px;background:#F2F7FB;color:#6b7a90;font-size:12px">Comprá con alguien que te asesore. · quierovendermas.com.ar</td></tr>
  </table></td></tr></table></body></html>`;
}

// Mail para VideoCallShop: datos del cliente + botón para escribirle por WhatsApp
function mailEquipoHtml(r, cuando, hora) {
  const wa = `https://wa.me/${telefonoWhatsApp(r.telefono)}?text=${encodeURIComponent(
    `¡Hola ${r.nombre}! Te escribo de VideoCallShop para confirmar nuestra reunión de mañana (${cuando}) a las ${hora} h.`
  )}`;
  const fila = (k, v) => `<tr><td style="padding:6px 0;color:#6b7a90;width:120px">${k}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#F2F7FB;font-family:Poppins,Arial,sans-serif;color:#0F1B2D">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F7FB;padding:32px 12px"><tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden">
    <tr><td style="background:#0F1B2D;padding:22px 28px;color:#ffffff;font-size:20px;font-weight:700">VideoCallShop · Reunión de mañana</td></tr>
    <tr><td style="padding:28px">
      <div style="background:#F2F7FB;border-left:5px solid #29D2AB;border-radius:10px;padding:16px 18px;font-size:18px;font-weight:700;margin-bottom:18px">
        ${esc(cuando)} · ${esc(hora)} h
      </div>
      <table cellpadding="0" cellspacing="0" style="font-size:15px;margin-bottom:22px">
        ${fila("Cliente", r.nombre)}${fila("Empresa", r.empresa)}${fila("Teléfono", r.telefono)}${fila("Mail", r.email)}
      </table>
      <a href="${wa}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 24px;border-radius:999px">Escribirle por WhatsApp</a>
      <p style="margin:16px 0 0;font-size:13px;color:#6b7a90">Ya le enviamos el recordatorio a ${esc(r.email)}.</p>
    </td></tr>
  </table></td></tr></table></body></html>`;
}

async function main() {
  const fecha = env("FECHA", false) || mananaArgentina();
  const cuando = textoFecha(fecha);
  const lista = await reunionesDe(fecha);
  console.log(`Reuniones del ${fecha} (${cuando}) sin recordatorio: ${lista.length}`);
  if (!lista.length) return;

  const transport = DRY
    ? nodemailer.createTransport({ jsonTransport: true })
    : nodemailer.createTransport({ service: "gmail", auth: { user: GMAIL_USER, pass: GMAIL_PASS } });

  let errores = 0;
  for (const r of lista) {
    const hora = String(r.hora).slice(0, 5);
    try {
      const info = await transport.sendMail({
        from: `"VideoCallShop" <${GMAIL_USER}>`,
        to: r.email,
        replyTo: COPIA,
        subject: `Recordatorio: tu reunión con VideoCallShop es mañana a las ${hora} h`,
        text:
          `¡Hola ${r.nombre}!\n\nTe recordamos tu reunión con VideoCallShop: ${cuando} a las ${hora} h ` +
          `(hora Argentina, ${DURACION_MIN} min).\n\nTe enviamos el link de la videollamada por WhatsApp o por este mail. ` +
          `Si necesitás cambiar el horario, respondé este mail o escribinos a wa.me/${WHATSAPP}.\n\nEquipo VideoCallShop`,
        html: mailHtml(r, cuando, hora),
      });
      const infoEquipo = await transport.sendMail({
        from: `"VideoCallShop" <${GMAIL_USER}>`,
        to: COPIA,
        replyTo: r.email,
        subject: `Mañana ${hora} h: reunión con ${r.nombre} (${r.empresa})`,
        text:
          `Reunión de mañana: ${cuando} a las ${hora} h\n\nCliente: ${r.nombre}\nEmpresa: ${r.empresa}\n` +
          `Teléfono: ${r.telefono}\nMail: ${r.email}\n\nEscribirle por WhatsApp: https://wa.me/${telefonoWhatsApp(r.telefono)}`,
        html: mailEquipoHtml(r, cuando, hora),
      });
      if (DRY) {
        const m = JSON.parse(info.message);
        const me = JSON.parse(infoEquipo.message);
        console.log(`[DRY_RUN] para ${m.to?.[0]?.address} — ${m.subject}`);
        console.log(`[DRY_RUN] para ${me.to?.[0]?.address} — ${me.subject} — WhatsApp: wa.me/${telefonoWhatsApp(r.telefono)}`);
      } else {
        await marcarEnviado(r.id);
        console.log(`Enviado a ${r.email} (${r.empresa}) — ${hora} h`);
      }
    } catch (e) {
      errores++;
      console.error(`Error con ${r.email}:`, e.message);
    }
  }
  if (errores) process.exit(1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
