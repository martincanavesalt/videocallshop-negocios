// Medición de conversiones (Meta Pixel + Google Tag Manager).
//
// Google Tag Manager (GTM-MGQGXK74) está en public/index.html y es quien carga
// el Meta Pixel. No hay otro píxel en el código: así cada evento llega una sola vez.
// Acá se disparan los eventos de cada acción. Cada evento sale por DOS vías:
//   1) Meta Pixel (fbq, cargado por GTM): eventos estándar que Meta usa para optimizar.
//   2) dataLayer de GTM: para que la agencia arme sus propios tags/conversiones.
// Detalle para quien administra las campañas: MEDICION.md

// GTM carga el píxel de forma asíncrona. Si alguien hace clic antes de que
// window.fbq exista, guardamos el evento y lo mandamos apenas aparece
// (reintentamos hasta 10 s; si el píxel nunca carga, se descarta sin romper nada).
const pendientes = [];
let esperando = false;

function enviarPendientes() {
  while (pendientes.length) {
    try {
      window.fbq.apply(window, pendientes.shift());
    } catch (err) {
      /* noop */
    }
  }
}

function fbqSend(...args) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.fbq === "function") {
      window.fbq(...args);
      return;
    }
    pendientes.push(args);
    if (esperando) return;
    esperando = true;
    let intentos = 0;
    const timer = setInterval(() => {
      intentos += 1;
      if (typeof window.fbq === "function") {
        clearInterval(timer);
        esperando = false;
        enviarPendientes();
      } else if (intentos >= 20) {
        clearInterval(timer);
        esperando = false;
        pendientes.length = 0;
      }
    }, 500);
  } catch (err) {
    // la medición nunca debe romper la página
  }
}

function fbqTrack(evento, params) {
  fbqSend("track", evento, params || {});
}

function fbqCustom(evento, params) {
  fbqSend("trackCustom", evento, params || {});
}

function dataLayerPush(evento, params) {
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: evento, ...(params || {}) });
  } catch (err) {
    /* noop */
  }
}

// Clic en cualquier botón de WhatsApp. `ubicacion`: hero, flotante, planes, agenda, cierre, footer…
export function trackWhatsApp(ubicacion) {
  fbqTrack("Contact", { content_name: "whatsapp", ubicacion });
  dataLayerPush("vcs_whatsapp_click", { ubicacion });
}

// Clic en "Quiero una demo" / "Agendá una demo" (lleva al bloque de agenda).
// Es un evento personalizado a propósito: NO usar "Schedule" acá. "Schedule" se
// reserva para la reunión confirmada; si lo disparara el clic, Meta contaría
// cada visita al bloque como una reunión agendada.
export function trackClickDemo(ubicacion) {
  fbqCustom("ClickAgendaDemo", { ubicacion });
  dataLayerPush("vcs_demo_click", { ubicacion });
}

// Reunión agendada con éxito (quedó guardada en la base).
export function trackReunionAgendada({ rubro, plan } = {}) {
  fbqTrack("Schedule", { content_name: "reunion_demo", content_category: rubro || "", plan: plan || "" });
  dataLayerPush("vcs_reunion_agendada", { rubro: rubro || "", plan: plan || "" });
}

// Formulario de la guía gratis enviado con éxito.
export function trackLeadGuia({ rubro } = {}) {
  fbqTrack("Lead", { content_name: "guia_gratis", content_category: rubro || "" });
  dataLayerPush("vcs_lead_guia", { rubro: rubro || "" });
}

// Clic en el botón de un plan.
export function trackClickPlan(plan) {
  fbqCustom("ClickPlan", { plan });
  dataLayerPush("vcs_plan_click", { plan });
}
