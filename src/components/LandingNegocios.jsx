import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./LandingNegocios.css";

const WHATSAPP_NUMBER = "54933415858527"; // solo dígitos, formato internacional sin "+"
const WHATSAPP_MESSAGE = "Hola! Quiero sumar mi negocio a VideoCallShop.";

const RUBROS = ["Indumentaria", "Calzado", "Electro", "Cosmética", "Otro"];

export default function LandingNegocios() {
  const [form, setForm] = useState({
    nombre: "",
    negocio: "",
    rubro: "",
    whatsapp: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const { error } = await supabase.from("leads").insert([
      {
        nombre: form.nombre,
        negocio: form.negocio,
        rubro: form.rubro,
        whatsapp: form.whatsapp,
      },
    ]);

    if (error) {
      console.error("Error guardando el lead:", error);
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm({ nombre: "", negocio: "", rubro: "", whatsapp: "" });
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <div className="vcs-landing">
      {/* WHATSAPP FLOTANTE */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="vcs-whatsapp-float"
        aria-label="Escribinos por WhatsApp"
      >
        <WhatsAppIcon />
      </a>

      {/* HERO */}
      <section className="vcs-hero">
        <div className="vcs-hero-inner">
          <span className="vcs-eyebrow">Nueva oportunidad para tu negocio</span>
          <h1 className="vcs-display">
            Duplicá las ventas de tu <span className="vcs-accent">local físico</span> sin
            costos fijos
          </h1>
          <p>
            Vendé en vivo por videollamada, desde tu propio local, sin invertir en
            logística ni personal extra.
          </p>
          <div className="vcs-btn-row">
            <a href="#form" className="vcs-btn vcs-btn-primary">
              ▶ Quiero mi guía
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="vcs-btn vcs-btn-ghost"
            >
              <WhatsAppIcon size={16} /> Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="vcs-benefits">
        <div className="vcs-benefits-grid">
          <div className="vcs-benefit">
            <div className="vcs-icon">$</div>
            <h3>Sin costos fijos</h3>
            <p>Empezás a vender con lo que ya tenés: tu celular y tu stock.</p>
          </div>
          <div className="vcs-benefit">
            <div className="vcs-icon">▶</div>
            <h3>Empezá hoy</h3>
            <p>Configurás tu cuenta y hacés tu primer live el mismo día.</p>
          </div>
          <div className="vcs-benefit">
            <div className="vcs-icon">◉</div>
            <h3>Como en el local</h3>
            <p>Asesorás en vivo igual que en el mostrador, pero a quien esté en su casa.</p>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="vcs-form-section" id="form">
        <div className="vcs-form-grid">
          <div className="vcs-form-copy">
            <span className="vcs-tag">Guía gratis</span>
            <h2 className="vcs-display">Cómo armar tu primer live shopping exitoso</h2>
            <p>Dejanos tus datos y te mandamos la guía por WhatsApp, al instante.</p>
            <ul>
              <li>Qué productos mostrar primero</li>
              <li>Cómo anunciar tu live sin gastar en publicidad</li>
              <li>Errores comunes que bajan las ventas</li>
            </ul>
          </div>

          <form className="vcs-card" onSubmit={handleSubmit}>
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

            <button className="vcs-submit-btn" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Enviando..." : "Quiero mi guía gratis"}
            </button>

            {status === "success" && (
              <p className="vcs-form-note vcs-success">
                ¡Listo! Te contactamos por WhatsApp en breve.
              </p>
            )}
            {status === "error" && (
              <p className="vcs-form-note vcs-error">
                Hubo un problema al enviar. Probá de nuevo o escribinos por WhatsApp.
              </p>
            )}
            {status === "idle" && (
              <p className="vcs-form-note">Te llega por WhatsApp en el momento. Sin spam.</p>
            )}
          </form>
        </div>
      </section>

      {/* CIERRE */}
      <section className="vcs-closing">
        <div className="vcs-closing-inner">
          <div className="vcs-closing-text">
            <span className="vcs-eyebrow vcs-eyebrow-coral">Disponible ahora</span>
            <h2 className="vcs-display">
              Empezá a<br />
              <span className="vcs-green">vender hoy</span>
            </h2>
            <p>
              Tu local ya tiene el producto y la confianza de tus clientes. Solo falta
              llevarlos a la pantalla.
            </p>
          </div>
          <a href="#form" className="vcs-btn vcs-btn-primary">
            Empezar ahora →
          </a>
        </div>
      </section>
    </div>
  );
}

function WhatsAppIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.17 1.71 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}
