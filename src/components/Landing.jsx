import React, { useState } from "react";
import "./Landing.css";
import heroImg from "../assets/hero.jpg";
import logo from "../assets/logo.png";
import Agenda from "./Agenda";
import {
  MARCA,
  HERO,
  CLIENTES,
  INTEGRACIONES,
  PASOS,
  VIDEO,
  BENEFICIOS,
  TESTIMONIOS,
  PLANES,
  PLAN_INCLUYE,
  PLANES_LEGAL,
  FAQS,
} from "../contenido";
import { trackWhatsApp, trackClickDemo, trackClickPlan } from "../medicion";

// Todo el contenido editable (textos, planes, logos, testimonios, video) está en src/contenido.js

const waLink = (texto) => `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(texto)}`;

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [planInteres, setPlanInteres] = useState("");

  const whatsappHref = waLink(MARCA.whatsappMensaje);
  const closeMenu = () => setMenuOpen(false);

  const WaBtn = ({ ubicacion, className, children }) => (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackWhatsApp(ubicacion)}
    >
      {children}
    </a>
  );

  return (
    <div className="qvm">
      {/* ================= 1. HEADER ================= */}
      <header className="qvm-nav">
        <div className="qvm-container qvm-nav-inner">
          <a href="#top" className="qvm-logo" onClick={closeMenu} aria-label="VideoCallShop, inicio">
            <img src={logo} alt="" className="qvm-logo-img" />
            <span>{MARCA.nombre}</span>
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
            <a href="#como-funciona" onClick={closeMenu}>Cómo funciona</a>
            <a href="#planes" onClick={closeMenu}>Planes</a>
            <a href="#faq" onClick={closeMenu}>Preguntas</a>
            <a
              href="#agenda"
              className="qvm-btn qvm-btn-primary qvm-btn-sm"
              onClick={() => {
                closeMenu();
                trackClickDemo("header");
              }}
            >
              Agendá una demo
            </a>
          </nav>
        </div>
      </header>

      {/* ================= 2. HERO ================= */}
      <section className="qvm-hero" id="top">
        <div className="qvm-container qvm-hero-grid">
          <div className="qvm-hero-copy">
            <span className="qvm-pill">
              <span className="qvm-live-dot" /> {HERO.etiqueta}
            </span>
            <h1>
              {HERO.titulo}
              <br />
              <span className="qvm-accent">{HERO.tituloAcento}</span>
            </h1>
            <p className="qvm-lead">{HERO.bajada}</p>
            <div className="qvm-btn-row">
              <a href="#agenda" className="qvm-btn qvm-btn-primary" onClick={() => trackClickDemo("hero")}>
                Quiero una demo →
              </a>
              <WaBtn ubicacion="hero" className="qvm-btn qvm-btn-ghost">
                <WhatsAppIcon size={18} /> Hablar por WhatsApp
              </WaBtn>
            </div>
            <ul className="qvm-hero-checks">
              {HERO.destacados.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>

          <div className="qvm-hero-media">
            <figure className="qvm-hero-photo">
              <img src={heroImg} alt={HERO.imagenAlt} />
              <span className="qvm-hero-live">● EN VIVO</span>
            </figure>
            <div className="qvm-float qvm-float-1">
              <Icon name="card" /> <span>Cobrás en la llamada</span>
            </div>
            <div className="qvm-float qvm-float-2">
              <Icon name="check" /> <span>Venta cerrada</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. PRUEBA SOCIAL + INTEGRACIONES ================= */}
      <section className="qvm-proof" aria-label="Clientes e integraciones">
        {CLIENTES.length > 0 && (
          <div className="qvm-container qvm-clients">
            <p className="qvm-strip-title">Ya venden con {MARCA.nombre}</p>
            <div className="qvm-clients-row">
              {CLIENTES.map((c) => (
                <img key={c.nombre} src={c.logo} alt={c.nombre} title={c.nombre} loading="lazy" />
              ))}
            </div>
          </div>
        )}
        <div className="qvm-container">
          <p className="qvm-strip-title">Cobrá y enviá con lo que ya usás</p>
          <div className="qvm-integrations">
            {INTEGRACIONES.map((it) => (
              <LogoOTexto key={it.nombre} {...it} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. CÓMO FUNCIONA + VIDEO ================= */}
      <section className="qvm-section" id="como-funciona">
        <div className="qvm-container">
          <div className="qvm-section-head">
            <span className="qvm-eyebrow">Cómo funciona</span>
            <h2>De la consulta a la venta, en una videollamada</h2>
            <p>Así de simple es vender en vivo desde tu local.</p>
          </div>
          <div className="qvm-how">
            <ol className="qvm-how-steps">
              {PASOS.map((p, i) => (
                <li className="qvm-how-step" key={p.titulo}>
                  <span className="qvm-step-n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
              <li className="qvm-how-cta">
                <a href="#agenda" className="qvm-btn qvm-btn-primary" onClick={() => trackClickDemo("como-funciona")}>
                  Quiero verlo en una demo
                </a>
              </li>
            </ol>
            <VideoDemo video={VIDEO} />
          </div>
        </div>
      </section>

      {/* ================= 5. BENEFICIOS (4) ================= */}
      <section className="qvm-section qvm-section-tint" id="beneficios">
        <div className="qvm-container">
          <div className="qvm-section-head">
            <span className="qvm-eyebrow">Beneficios</span>
            <h2>Lo que gana tu negocio</h2>
          </div>
          <div className="qvm-feature-grid qvm-feature-grid-4">
            {BENEFICIOS.map((b) => (
              <article className="qvm-feature" key={b.titulo}>
                <div className="qvm-feature-icon">
                  <Icon name={b.icono} />
                </div>
                <h3>{b.titulo}</h3>
                <p>{b.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. TESTIMONIOS (solo con contenido real) ================= */}
      {TESTIMONIOS.length > 0 && (
        <section className="qvm-section" id="testimonios">
          <div className="qvm-container">
            <div className="qvm-section-head">
              <span className="qvm-eyebrow">Testimonios</span>
              <h2>Comercios que ya venden en vivo</h2>
            </div>
            <div className="qvm-testimonials">
              {TESTIMONIOS.map((t) => (
                <figure className="qvm-testimonial" key={`${t.local}-${t.nombre}`}>
                  <blockquote>“{t.frase}”</blockquote>
                  <figcaption>
                    {t.foto && <img src={t.foto} alt="" loading="lazy" />}
                    <span>
                      <strong>{t.local}</strong>
                      <small>
                        {t.nombre}
                        {t.rubro ? ` · ${t.rubro}` : ""}
                      </small>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 7. PLANES (unificados con soluciones) ================= */}
      <section className="qvm-section qvm-pricing" id="planes">
        <div className="qvm-container">
          <div className="qvm-section-head">
            <span className="qvm-eyebrow qvm-eyebrow-light">Planes</span>
            <h2>Elegí el plan para tu negocio</h2>
            <p>Un precio por marca, sin importar la cantidad de locales ni de usuarios.</p>
          </div>
          <div className="qvm-price-grid">
            {PLANES.map((p) => (
              <article className={`qvm-price ${p.recomendado ? "is-featured" : ""}`} key={p.id}>
                {p.recomendado && <span className="qvm-plan-badge">Recomendado</span>}
                <span className="qvm-price-ideal">Ideal para {p.idealPara.toLowerCase()}</span>
                <h3>{p.nombre}</h3>
                <p className="qvm-price-desc">{p.descripcion}</p>
                <div className="qvm-price-amount">
                  <span className="qvm-price-cur">$</span>
                  <strong>{p.precio}</strong>
                  <span className="qvm-price-per">/mes</span>
                </div>
                <div className="qvm-price-min">
                  <strong>{p.minutos}</strong>
                  <span>{p.unidad}</span>
                </div>
                <ul>
                  {PLAN_INCLUYE.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <a
                  href="#agenda"
                  className="qvm-btn qvm-btn-primary qvm-btn-block"
                  onClick={() => {
                    setPlanInteres(p.nombre);
                    trackClickPlan(p.nombre);
                    trackClickDemo(`plan:${p.id}`);
                  }}
                >
                  Agendá tu demo
                </a>
                <a
                  href={waLink(`¡Hola! Me interesa el ${p.nombre} de VideoCallShop.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="qvm-price-wa"
                  onClick={() => trackWhatsApp(`plan:${p.id}`)}
                >
                  o consultá por WhatsApp
                </a>
              </article>
            ))}
          </div>
          <p className="qvm-price-legal">{PLANES_LEGAL}</p>
        </div>
      </section>

      {/* ================= 8. AGENDÁ TU DEMO ================= */}
      <Agenda whatsappHref={whatsappHref} planInteres={planInteres} />

      {/* ================= 9. PREGUNTAS FRECUENTES ================= */}
      <section className="qvm-section" id="faq">
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

      {/* ================= 10. CIERRE ================= */}
      <section className="qvm-cta">
        <div className="qvm-container qvm-cta-inner">
          <h2>
            Vendé desde tu local.
            <br />
            <span>Videollamadas y vivos en una sola app.</span>
          </h2>
          <div className="qvm-btn-row qvm-btn-row-center">
            <a href="#agenda" className="qvm-btn qvm-btn-light" onClick={() => trackClickDemo("cierre")}>
              Agendá tu demo →
            </a>
            <WaBtn ubicacion="cierre" className="qvm-btn qvm-btn-ghost-light">
              <WhatsAppIcon size={18} /> WhatsApp
            </WaBtn>
          </div>
        </div>
      </section>

      {/* ================= 11. FOOTER ================= */}
      <footer className="qvm-footer">
        <div className="qvm-container qvm-footer-grid">
          <div>
            <a href="#top" className="qvm-logo qvm-logo-light" aria-label="VideoCallShop, inicio">
              <img src={logo} alt="" className="qvm-logo-img" />
              <span>{MARCA.nombre}</span>
            </a>
            <p className="qvm-footer-lema">{MARCA.lema}</p>
            <p className="qvm-footer-tag">
              App de ventas por videollamada para comercios. Hecho en Rosario.
            </p>
          </div>
          <div>
            <h4>Producto</h4>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#planes">Planes y precios</a>
            <a href="#faq">Preguntas frecuentes</a>
            <a href="#agenda" onClick={() => trackClickDemo("footer")}>Agendá una demo</a>
          </div>
          <div>
            <h4>Contacto</h4>
            <WaBtn ubicacion="footer">WhatsApp {MARCA.whatsappVisible}</WaBtn>
            <a href={`https://instagram.com/${MARCA.instagram}`} target="_blank" rel="noopener noreferrer">
              @{MARCA.instagram}
            </a>
            <a href={`https://${MARCA.web}`} target="_blank" rel="noopener noreferrer">
              {MARCA.web}
            </a>
            <a href={`mailto:${MARCA.email}`}>{MARCA.email}</a>
          </div>
        </div>
        <div className="qvm-container qvm-footer-bottom">
          © {new Date().getFullYear()} {MARCA.nombre} · {MARCA.dominio} — Todos los derechos reservados.
        </div>
      </footer>

      {/* WHATSAPP FLOTANTE */}
      <WaBtn ubicacion="flotante" className="qvm-whatsapp-float">
        <WhatsAppIcon />
        <span className="qvm-sr">Escribinos por WhatsApp</span>
      </WaBtn>
    </div>
  );
}

/* ---------- Logo de integración con respaldo en texto ---------- */
function LogoOTexto({ nombre, logo }) {
  const [falla, setFalla] = useState(!logo);
  return (
    <span className="qvm-integration" title={nombre}>
      {falla ? (
        <span className="qvm-integration-text">{nombre}</span>
      ) : (
        <img src={logo} alt={nombre} loading="lazy" onError={() => setFalla(true)} />
      )}
    </span>
  );
}

/* ---------- Video de la app funcionando ---------- */
function VideoDemo({ video }) {
  if (!video || !video.src) return null;
  let player = null;
  if (video.tipo === "mp4") {
    player = <video src={video.src} controls playsInline preload="metadata" title={video.titulo} />;
  } else if (video.tipo === "youtube") {
    player = (
      <iframe
        src={video.src}
        title={video.titulo}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  } else if (video.tipo === "instagram") {
    const base = video.src.endsWith("/") ? video.src : `${video.src}/`;
    player = (
      <iframe
        src={`${base}embed/`}
        title={video.titulo}
        loading="lazy"
        scrolling="no"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    );
  }
  return (
    <figure className={`qvm-video qvm-video-${video.tipo}`}>
      <div className="qvm-video-frame">{player}</div>
      <figcaption>{video.titulo}</figcaption>
    </figure>
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
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
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
