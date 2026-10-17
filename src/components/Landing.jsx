import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Landing.css";

/* =========================================================
   CONFIGURACIÓN RÁPIDA — editá estos valores
   ========================================================= */
const BRAND = "VideoCallShop";
const DOMAIN = "quierovendermas.com.ar";
const WHATSAPP_NUMBER = "54933415858527"; // solo dígitos, formato internacional sin "+"
const WHATSAPP_MESSAGE = "Hola! Quiero vender más con VideoCallShop.";
const CONTACT_EMAIL = "videocallshoppping@gmail.com";

// Mail de aviso: se dispara además del guardado en Supabase, solo para notificar.
const NOTIFY_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const RUBROS = ["Indumentaria", "Calzado", "Electro", "Cosmética", "Hogar y deco", "Otro"];

// Plataformas que se muestran en la cinta animada. Dejá solo las que realmente uses.
const INTEGRACIONES = [
  "Mercado Pago",
  "Tiendanube",
  "Transferencia",
  "Andreani",
  "Correo Argentino",
  "OCA",
  "WhatsApp",
  "Link de pago",
];

const BENEFICIOS = [
  {
    icon: "person",
    title: "Atención personalizada",
    text: "Ofrecé un diferencial a tus clientes vendiendo con atención personalizada: asesorás cara a cara, como en el mostrador, pero estén donde estén.",
  },
  {
    icon: "check",
    title: "Cerrá la venta durante la llamada",
    text: "El cliente ve el producto, pregunta y paga sin cortar. Nada de “después te escribo”: la decisión se toma en vivo.",
  },
  {
    icon: "truck",
    title: "Envíos integrados",
    text: "Coordinás el envío en el mismo momento de la compra, con los operadores que ya usás. Tu cliente sabe cuándo le llega.",
  },
  {
    icon: "card",
    title: "Diferentes checkouts",
    text: "Link de pago, Mercado Pago, transferencia o tu tienda online: cada cliente paga como le resulta más cómodo.",
  },
  {
    icon: "globe",
    title: "Vendé como se vende en el mundo",
    text: "Vendé en vivo como se está vendiendo a nivel mundial. El live shopping ya es parte de cómo compra la gente en Asia, EE.UU. y Europa.",
  },
  {
    icon: "bolt",
    title: "Sin costos fijos",
    text: "Empezás con lo que ya tenés: tu celular, tu stock y tu local. Sin invertir en estructura ni personal extra.",
  },
];

const PASOS = [
  {
    n: "01",
    title: "Tu cliente pide la llamada",
    text: "Desde tu web, Instagram o WhatsApp, con un solo botón.",
  },
  {
    n: "02",
    title: "Le mostrás en vivo",
    text: "Recorrés el local, mostrás talles, colores y detalles. Respondés todo en el momento.",
  },
  {
    n: "03",
    title: "Cobrás y despachás",
    text: "Elige cómo pagar, confirmás el envío y la venta queda cerrada antes de colgar.",
  },
];

const PERFILES = [
  {
    tag: "EMPRENDEDOR",
    title: "Para arrancar",
    text: "Ideal si vendés por redes y querés dar el salto a la venta en vivo.",
    items: ["Videollamadas 1 a 1", "Link de pago en la llamada", "Guía de primer live"],
    cta: "Quiero empezar",
  },
  {
    tag: "LOCAL",
    title: "Para tu negocio",
    text: "Para locales físicos que quieren vender a clientes que no pueden acercarse.",
    items: [
      "Atención por turnos y en vivo",
      "Varios vendedores atendiendo",
      "Envíos integrados",
      "Diferentes checkouts",
    ],
    cta: "Quiero vender más",
    featured: true,
  },
  {
    tag: "MARCA",
    title: "Para escalar",
    text: "Para marcas y cadenas con varias sucursales y eventos de live shopping.",
    items: ["Eventos en vivo masivos", "Integración a medida", "Acompañamiento comercial"],
    cta: "Consultar",
  },
];

const FAQS = [
  {
    q: "¿Necesito equipamiento especial?",
    a: "No. Con un celular con buena cámara y conexión estable ya podés empezar. Te damos tips para que la imagen y el sonido se vean profesionales.",
  },
  {
    q: "¿Cómo me pagan los clientes?",
    a: "Durante la llamada le enviás el medio de pago que prefiera: link de pago, Mercado Pago, transferencia o el checkout de tu tienda online.",
  },
  {
    q: "¿Y el envío?",
    a: "Lo coordinás en el mismo momento de la venta con el operador logístico que ya usás, o el cliente retira en el local.",
  },
  {
    q: "¿Cuánto tardo en empezar?",
    a: "Podés hacer tu primera venta en vivo el mismo día. Dejanos tus datos y te mandamos la guía por WhatsApp.",
  },
];

/* ========================================================= */

export default function Landing() {
  const [form, setForm] = useState({ nombre: "", negocio: "", rubro: "", whatsapp: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    if (!supabase) {
      console.error("Supabase no está configurado (faltan las claves).");
      setStatus("error");
      return;
    }

    const { error } = await supabase.from("leads").insert([{ ...form }]);

    if (error) {
      console.error("Error guardando el lead:", error);
      setStatus("error");
      return;
    }

    // Aviso por mail (best-effort): si falla, el lead ya quedó guardado en Supabase igual.
    try {
      await fetch(NOTIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Nombre: form.nombre,
          Negocio: form.negocio,
          Rubro: form.rubro,
          WhatsApp: form.whatsapp,
          _subject: `Nuevo lead ${BRAND}: ${form.negocio || form.nombre}`,
        }),
      });
    } catch (notifyError) {
      console.warn("No se pudo enviar el aviso por mail:", notifyError);
    }

    setStatus("success");
    setForm({ nombre: "", negocio: "", rubro: "", whatsapp: "" });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="qvm">
      {/* ================= NAV ================= */}
      <header className="qvm-nav">
        <div className="qvm-container qvm-nav-inner">
          <a href="#top" className="qvm-logo" onClick={closeMenu}>
            <span className="qvm-logo-dot" aria-hidden="true" />
            <span>Video<b>Call</b>Shop</span>
          </a>

          <button
            className="qvm-burger"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`qvm-links ${menuOpen ? "is-open" : ""}`}>
            <a href="#beneficios" onClick={closeMenu}>Beneficios</a>
            <a href="#como-funciona" onClick={closeMenu}>Cómo funciona</a>
            <a href="#soluciones" onClick={closeMenu}>Soluciones</a>
            <a href="#faq" onClick={closeMenu}>Preguntas</a>
            <a href="#contacto" className="qvm-btn qvm-btn-primary qvm-btn-sm" onClick={closeMenu}>
              Solicitar demo
            </a>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="qvm-hero" id="top">
        <div className="qvm-hero-glow" aria-hidden="true" />
        <div className="qvm-container qvm-hero-grid">
          <div className="qvm-hero-copy">
            <span className="qvm-pill">
              <span className="qvm-live-dot" /> Live Shopping por videollamada
            </span>
            <h1>
              Vendé en vivo.
              <br />
              <span className="qvm-gradient-text">Vendé más.</span>
            </h1>
            <p className="qvm-lead">
              Experiencias de compra por videollamada que inspiran, conectan y convierten.
              Ofrecé un diferencial a tus clientes vendiendo con atención personalizada.
            </p>
            <div className="qvm-btn-row">
              <a href="#contacto" className="qvm-btn qvm-btn-primary">
                Quiero vender más →
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="qvm-btn qvm-btn-ghost"
              >
                <WhatsAppIcon size={18} /> Hablar por WhatsApp
              </a>
            </div>
            <ul className="qvm-hero-checks">
              <li>Cerrá la venta en la llamada</li>
              <li>Envíos integrados</li>
              <li>Diferentes checkouts</li>
            </ul>
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* ================= MARQUEE INTEGRACIONES ================= */}
      <section className="qvm-marquee" aria-label="Medios de pago y envío compatibles">
        <p className="qvm-marquee-title">Cobrá y enviá con lo que ya usás</p>
        <div className="qvm-marquee-track">
          {[...INTEGRACIONES, ...INTEGRACIONES].map((name, i) => (
            <span className="qvm-marquee-item" key={i} aria-hidden={i >= INTEGRACIONES.length}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ================= VALOR ================= */}
      <section className="qvm-section" id="beneficios">
        <div className="qvm-container">
          <div className="qvm-section-head">
            <span className="qvm-eyebrow">Por qué vender en vivo</span>
            <h2>
              Potenciá tus ventas con <span className="qvm-gradient-text">{BRAND}</span>
            </h2>
            <p>
              Llevá la experiencia de tu local a la pantalla de tus clientes. Mostrás,
              asesorás, cobrás y despachás en una sola conversación.
            </p>
          </div>

          <div className="qvm-feature-grid">
            {BENEFICIOS.map((b) => (
              <article className="qvm-feature" key={b.title}>
                <div className="qvm-feature-icon">
                  <Icon name={b.icon} />
                </div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BANDA MUNDIAL ================= */}
      <section className="qvm-world">
        <div className="qvm-container qvm-world-inner">
          <div>
            <span className="qvm-eyebrow qvm-eyebrow-light">Tendencia global</span>
            <h2>Vendé en vivo como se está vendiendo a nivel mundial</h2>
          </div>
          <p>
            En China, Estados Unidos y Europa, comprar a través de un video en vivo ya es
            algo cotidiano. La gente quiere ver el producto, hacer preguntas y que alguien
            real la asesore. Ahora tu negocio puede ofrecer lo mismo, desde Argentina.
          </p>
        </div>
      </section>

      {/* ================= CÓMO FUNCIONA ================= */}
      <section className="qvm-section" id="como-funciona">
        <div className="qvm-container">
          <div className="qvm-section-head">
            <span className="qvm-eyebrow">Cómo funciona</span>
            <h2>De la consulta a la venta, en una llamada</h2>
          </div>
          <div className="qvm-steps">
            {PASOS.map((p) => (
              <div className="qvm-step" key={p.n}>
                <span className="qvm-step-n">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SOLUCIONES ================= */}
      <section className="qvm-section qvm-section-tint" id="soluciones">
        <div className="qvm-container">
          <div className="qvm-section-head">
            <span className="qvm-eyebrow">Soluciones</span>
            <h2>Descubrí la mejor opción para tu negocio</h2>
            <p>Empezá chico, medí resultados y escalá cuando estés listo.</p>
          </div>
          <div className="qvm-plans">
            {PERFILES.map((p) => (
              <article className={`qvm-plan ${p.featured ? "is-featured" : ""}`} key={p.tag}>
                {p.featured && <span className="qvm-plan-badge">Más elegido</span>}
                <span className="qvm-plan-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className={`qvm-btn ${p.featured ? "qvm-btn-primary" : "qvm-btn-outline"}`}
                >
                  {p.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FORMULARIO ================= */}
      <section className="qvm-section" id="contacto">
        <div className="qvm-container qvm-form-grid">
          <div className="qvm-form-copy">
            <span className="qvm-eyebrow">Guía gratis</span>
            <h2>Cómo armar tu primera venta en vivo exitosa</h2>
            <p>Dejanos tus datos y te mandamos la guía por WhatsApp, al instante.</p>
            <ul className="qvm-checklist">
              <li>Qué productos mostrar primero</li>
              <li>Cómo cerrar la venta antes de cortar la llamada</li>
              <li>Cómo ofrecer envíos y medios de pago sin fricción</li>
              <li>Errores comunes que bajan las ventas</li>
            </ul>
          </div>

          <form className="qvm-card" onSubmit={handleSubmit}>
            <h3>Solicitá tu demo</h3>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <label htmlFor="negocio">Nombre del negocio</label>
            <input
              id="negocio"
              name="negocio"
              type="text"
              placeholder="Ej: Indumentaria Sol"
              value={form.negocio}
              onChange={handleChange}
              required
            />

            <label htmlFor="rubro">Rubro</label>
            <select id="rubro" name="rubro" value={form.rubro} onChange={handleChange} required>
              <option value="">Seleccioná una opción</option>
              {RUBROS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              placeholder="Ej: 341 123 4567"
              value={form.whatsapp}
              onChange={handleChange}
              required
            />

            <button
              className="qvm-btn qvm-btn-primary qvm-btn-block"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Enviando..." : "Quiero vender más"}
            </button>

            {status === "success" && (
              <p className="qvm-form-note is-success">¡Listo! Te contactamos por WhatsApp en breve.</p>
            )}
            {status === "error" && (
              <p className="qvm-form-note is-error">
                Hubo un problema al enviar. Probá de nuevo o escribinos por WhatsApp.
              </p>
            )}
            {status === "idle" && (
              <p className="qvm-form-note">Te llega por WhatsApp en el momento. Sin spam.</p>
            )}
          </form>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="qvm-section qvm-section-tint" id="faq">
        <div className="qvm-container qvm-faq-wrap">
          <div className="qvm-section-head">
            <span className="qvm-eyebrow">Preguntas frecuentes</span>
            <h2>Todo lo que necesitás saber</h2>
          </div>
          <div className="qvm-faq">
            {FAQS.map((f, i) => (
              <div className={`qvm-faq-item ${openFaq === i ? "is-open" : ""}`} key={f.q}>
                <button
                  className="qvm-faq-q"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {f.q}
                  <span className="qvm-faq-sign" aria-hidden="true">+</span>
                </button>
                <div className="qvm-faq-a">
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="qvm-cta">
        <div className="qvm-container qvm-cta-inner">
          <h2>
            Tu local ya tiene el producto y la confianza.
            <br />
            <span>Llevalo a la pantalla de tus clientes.</span>
          </h2>
          <div className="qvm-btn-row qvm-btn-row-center">
            <a href="#contacto" className="qvm-btn qvm-btn-light">
              Empezar ahora →
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="qvm-btn qvm-btn-ghost-light"
            >
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="qvm-footer">
        <div className="qvm-container qvm-footer-grid">
          <div>
            <a href="#top" className="qvm-logo qvm-logo-light">
              <span className="qvm-logo-dot" aria-hidden="true" />
              <span>Video<b>Call</b>Shop</span>
            </a>
            <p className="qvm-footer-tag">Live shopping por videollamada para negocios argentinos.</p>
          </div>
          <div>
            <h4>Soluciones</h4>
            <a href="#soluciones">Emprendedor</a>
            <a href="#soluciones">Local</a>
            <a href="#soluciones">Marca</a>
          </div>
          <div>
            <h4>Contacto</h4>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href="#contacto">Solicitá una demo</a>
          </div>
        </div>
        <div className="qvm-container qvm-footer-bottom">
          © {new Date().getFullYear()} {BRAND} · {DOMAIN} — Todos los derechos reservados.
        </div>
      </footer>

      {/* WHATSAPP FLOTANTE */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="qvm-whatsapp-float"
        aria-label="Escribinos por WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}

/* ---------- Mockup del hero: celular con una videollamada en vivo ---------- */
function HeroMockup() {
  return (
    <div className="qvm-mockup" aria-hidden="true">
      <div className="qvm-phone">
        <div className="qvm-phone-screen">
          <div className="qvm-phone-top">
            <span className="qvm-badge-live">● EN VIVO</span>
            <span className="qvm-viewers">Atención 1 a 1</span>
          </div>
          <div className="qvm-seller">
            <div className="qvm-seller-head" />
            <div className="qvm-seller-body" />
            <div className="qvm-product-hanger">
              <div className="qvm-product-shirt" />
            </div>
          </div>
          <div className="qvm-pip">
            <div className="qvm-pip-face" />
          </div>
          <div className="qvm-chat">
            <div className="qvm-bubble">¿Lo tenés en talle M? 😍</div>
            <div className="qvm-bubble qvm-bubble-me">¡Sí! Te lo muestro 👇</div>
          </div>
          <div className="qvm-buy-card">
            <div className="qvm-buy-thumb" />
            <div className="qvm-buy-info">
              <strong>Camisa lino</strong>
              <small>Talle M · Arena</small>
            </div>
            <span className="qvm-buy-btn">Pagar</span>
          </div>
        </div>
      </div>

      <div className="qvm-float qvm-float-1">
        <Icon name="check" /> <span>Venta cerrada</span>
      </div>
      <div className="qvm-float qvm-float-2">
        <Icon name="truck" /> <span>Envío en 48 h</span>
      </div>
      <div className="qvm-float qvm-float-3">
        <Icon name="card" /> <span>Checkout elegido</span>
      </div>
    </div>
  );
}

/* ---------- Íconos ---------- */
function Icon({ name }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "person":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
      );
    case "card":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18M7 15h4" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
        </svg>
      );
    case "bolt":
    default:
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
        </svg>
      );
  }
}

function WhatsAppIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.17 1.71 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}
