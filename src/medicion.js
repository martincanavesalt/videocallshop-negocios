// Medición de conversiones (Meta Pixel + Google Tag Manager).
//
// El código base del Pixel y de GTM está en public/index.html. Acá se disparan
// los eventos de cada acción. Cada evento sale por DOS vías:
//   1) Meta Pixel directo (fbq): eventos estándar que Meta usa para optimizar.
//   2) dataLayer de GTM: para que la agencia arme sus propios tags/conversiones.
// Detalle para quien administra las campañas: MEDICION.md

function fbqTrack(evento, params) {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", evento, params || {});
    }
  } catch (err) {
    // la medición nunca debe romper la página
  }
}

function fbqCustom(evento, params) {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("trackCustom", evento, params || {});
    }
  } catch (err) {
    /* noop */
  }
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
