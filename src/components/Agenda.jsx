import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Agenda.css";

/* =========================================================
   CONFIGURACIÓN DE LA AGENDA — editá estos valores
   ========================================================= */
// Días disponibles: 0=domingo, 1=lunes, 2=martes, 3=miércoles, 4=jueves, 5=viernes, 6=sábado
const DIAS_DISPONIBLES = [2, 4]; // martes y jueves
const HORA_INICIO = 14; // 14:00
const HORA_FIN = 19; // la última reunión empieza antes de las 19:00
const DURACION_MIN = 30; // duración de cada reunión en minutos
const SEMANAS_A_MOSTRAR = 4;
// Fechas que NO querés ofrecer (feriados, vacaciones). Formato "AAAA-MM-DD".
const FECHAS_BLOQUEADAS = [];

const NOTIFY_EMAIL = "videocallshoppping@gmail.com";
const NOTIFY_ENDPOINT = `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`;
const TZ = "America/Argentina/Buenos_Aires";
/* ========================================================= */

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DIAS_LARGOS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const pad = (n) => String(n).padStart(2, "0");

// Fecha y hora actuales en Argentina, sin importar dónde esté el visitante
function ahoraArgentina() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return {
    fecha: `${get("year")}-${get("month")}-${get("day")}`,
    minutos: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  };
}

function generarDias() {
  const { fecha: hoy } = ahoraArgentina();
  const [y, m, d] = hoy.split("-").map(Number);
  const base = new Date(Date.UTC(y, m - 1, d));
  const dias = [];
  for (let i = 0; i < SEMANAS_A_MOSTRAR * 7; i++) {
    const f = new Date(base);
    f.setUTCDate(base.getUTCDate() + i);
    const iso = `${f.getUTCFullYear()}-${pad(f.getUTCMonth() + 1)}-${pad(f.getUTCDate())}`;
    if (DIAS_DISPONIBLES.includes(f.getUTCDay()) && !FECHAS_BLOQUEADAS.includes(iso)) {
      dias.push({ iso, dow: f.getUTCDay(), dia: f.getUTCDate(), mes: f.getUTCMonth() });
    }
  }
  return dias;
}

function generarHorarios() {
  const out = [];
  for (let t = HORA_INICIO * 60; t + DURACION_MIN <= HORA_FIN * 60; t += DURACION_MIN) {
    out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return out;
}

const aMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function linkGoogleCalendar(fecha, hora) {
  const [y, mo, d] = fecha.split("-").map(Number);
  const ini = aMin(hora);
  const fin = ini + DURACION_MIN;
  // Argentina = UTC-3 (sin horario de verano)
  const toUtc = (min) => {
    const dt = new Date(Date.UTC(y, mo - 1, d, 0, min + 180));
    return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(
      dt.getUTCHours()
    )}${pad(dt.getUTCMinutes())}00Z`;
  };
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Reunión con VideoCallShop",
    dates: `${toUtc(ini)}/${toUtc(fin)}`,
    details: "Reunión para conocer VideoCallShop. Te contactamos por WhatsApp o mail con el link de la videollamada.",
    ctz: TZ,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.17 1.71 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}

const VACIO = { nombre: "", telefono: "", email: "", empresa: "", interes: "" };

export default function Agenda({ onAgendado, whatsappHref, onWhatsApp }) {
  const dias = useMemo(generarDias, []);
  const horarios = useMemo(generarHorarios, []);
  const [fecha, setFecha] = useState(dias[0]?.iso || "");
  const [hora, setHora] = useState("");
  const [ocupados, setOcupados] = useState([]); // ["2026-10-27|14:30", ...]
  const [form, setForm] = useState(VACIO);
  const [status, setStatus] = useState("idle"); // idle | sending | success | taken | error
  const [confirmado, setConfirmado] = useState(null);

  // Trae los horarios ya reservados (solo fecha y hora, nunca datos de clientes)
  const cargarOcupados = async () => {
    if (!supabase || !dias.length) return;
    const { data, error } = await supabase.rpc("horarios_ocupados", {
      desde: dias[0].iso,
      hasta: dias[dias.length - 1].iso,
    });
    if (error) {
      console.warn("No se pudieron cargar los horarios ocupados:", error.message);
      return;
    }
    setOcupados((data || []).map((r) => `${r.fecha}|${String(r.hora).slice(0, 5)}`));
  };

  useEffect(() => {
    cargarOcupados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { fecha: hoy, minutos: ahoraMin } = ahoraArgentina();
  const disponible = (f, h) => {
    if (ocupados.includes(`${f}|${h}`)) return false;
    if (f === hoy && aMin(h) <= ahoraMin + 60) return false; // al menos 1 h de anticipación
    return true;
  };
  const libresDelDia = (f) => horarios.filter((h) => disponible(f, h)).length;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha || !hora) return;
    setStatus("sending");

    if (!supabase) {
      setStatus("error");
      return;
    }

    const { error } = await supabase.from("reuniones").insert([{ fecha, hora, ...form }]);

    if (error) {
      if (error.code === "23505") {
        // Alguien reservó ese horario recién
        setStatus("taken");
        setHora("");
        cargarOcupados();
      } else {
        console.error("Error guardando la reunión:", error);
        setStatus("error");
      }
      return;
    }

    const d = dias.find((x) => x.iso === fecha);
    const textoFecha = `${DIAS_LARGOS[d.dow]} ${d.dia} de ${MESES_LARGOS[d.mes]}`;

    try {
      await fetch(NOTIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Reunión: `${textoFecha} a las ${hora} h`,
          "Nombre y apellido": form.nombre,
          Teléfono: form.telefono,
          Mail: form.email,
          Empresa: form.empresa,
          "Por qué le interesó": form.interes,
          _subject: `Nueva reunión agendada: ${form.empresa} — ${textoFecha} ${hora} h`,
          _replyto: form.email,
        }),
      });
    } catch (err) {
      console.warn("No se pudo enviar el aviso por mail:", err);
    }

    if (onAgendado) onAgendado();
    setConfirmado({ textoFecha, hora, link: linkGoogleCalendar(fecha, hora) });
    setOcupados((p) => [...p, `${fecha}|${hora}`]);
    setStatus("success");
    setForm(VACIO);
    setHora("");
  };

  return (
    <section className="qvm-section qvm-agenda" id="agenda">
      <div className="qvm-container">
        <div className="qvm-section-head">
          <span className="qvm-eyebrow">Agendá una reunión</span>
          <h2>Conocé VideoCallShop en una videollamada</h2>
          <p>
            Elegí un día y un horario. Te mostramos la app y vemos juntos cómo sumarla a tu
            negocio. Martes y jueves de 14 a 19 h (hora Argentina).
          </p>
          {whatsappHref && (
            <a
              className="ag-wa"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsApp}
            >
              <WaIcon /> ¿Tenés dudas? Escribinos por WhatsApp
            </a>
          )}
        </div>

        {status === "success" && confirmado ? (
          <div className="ag-confirm">
            <div className="ag-confirm-icon" aria-hidden="true">✓</div>
            <h3>¡Listo! Tu reunión quedó agendada</h3>
            <p className="ag-confirm-when">
              {confirmado.textoFecha} a las {confirmado.hora} h
            </p>
            <p>Te contactamos por WhatsApp o mail con el link de la videollamada.</p>
            <div className="ag-confirm-actions">
              <a
                className="qvm-btn qvm-btn-primary"
                href={confirmado.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Agregar a Google Calendar
              </a>
              <button
                type="button"
                className="qvm-btn qvm-btn-outline"
                onClick={() => {
                  setStatus("idle");
                  setConfirmado(null);
                }}
              >
                Agendar otra
              </button>
            </div>
          </div>
        ) : (
          <form className="ag-card" onSubmit={handleSubmit}>
            {/* Paso 1: día */}
            <div className="ag-step">
              <h3>
                <span className="ag-n">1</span> Elegí el día
              </h3>
              <div className="ag-days" role="radiogroup" aria-label="Día de la reunión">
                {dias.map((d) => {
                  const libres = libresDelDia(d.iso);
                  return (
                    <button
                      type="button"
                      key={d.iso}
                      role="radio"
                      aria-checked={fecha === d.iso}
                      disabled={libres === 0}
                      className={`ag-day ${fecha === d.iso ? "is-active" : ""}`}
                      onClick={() => {
                        setFecha(d.iso);
                        setHora("");
                        if (status === "taken") setStatus("idle");
                      }}
                    >
                      <span className="ag-day-dow">{DIAS[d.dow]}</span>
                      <span className="ag-day-num">{d.dia}</span>
                      <span className="ag-day-mes">{MESES[d.mes]}</span>
                      <span className="ag-day-free">{libres === 0 ? "Completo" : `${libres} libres`}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paso 2: horario */}
            <div className="ag-step">
              <h3>
                <span className="ag-n">2</span> Elegí el horario
              </h3>
              <div className="ag-times" role="radiogroup" aria-label="Horario de la reunión">
                {horarios.map((h) => {
                  const ok = disponible(fecha, h);
                  return (
                    <button
                      type="button"
                      key={h}
                      role="radio"
                      aria-checked={hora === h}
                      disabled={!ok}
                      className={`ag-time ${hora === h ? "is-active" : ""}`}
                      onClick={() => {
                        setHora(h);
                        if (status === "taken") setStatus("idle");
                      }}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
              <p className="ag-hint">Cada reunión dura {DURACION_MIN} minutos.</p>
              {status === "taken" && (
                <p className="ag-msg is-error">
                  Ese horario se acaba de ocupar. Elegí otro, por favor.
                </p>
              )}
            </div>

            {/* Paso 3: datos */}
            <div className="ag-step">
              <h3>
                <span className="ag-n">3</span> Completá tus datos
              </h3>
              <div className="ag-fields">
                <label>
                  Nombre y apellido
                  <input name="nombre" value={form.nombre} onChange={handleChange} required autoComplete="name" />
                </label>
                <label>
                  Teléfono
                  <input
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    placeholder="Ej: 341 123 4567"
                  />
                </label>
                <label>
                  Mail
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </label>
                <label>
                  Empresa
                  <input
                    name="empresa"
                    value={form.empresa}
                    onChange={handleChange}
                    required
                    autoComplete="organization"
                  />
                </label>
                <label className="ag-full">
                  ¿Por qué te interesó nuestra app?
                  <textarea
                    name="interes"
                    rows="3"
                    value={form.interes}
                    onChange={handleChange}
                    required
                    placeholder="Contanos qué vendés y qué te gustaría resolver."
                  />
                </label>
              </div>
            </div>

            <div className="ag-submit">
              <p className="ag-summary">
                {hora
                  ? (() => {
                      const d = dias.find((x) => x.iso === fecha);
                      return (
                        <>
                          Reunión el <strong>{DIAS_LARGOS[d.dow]} {d.dia} de {MESES_LARGOS[d.mes]}</strong> a
                          las <strong>{hora} h</strong>
                        </>
                      );
                    })()
                  : "Elegí un día y un horario para continuar."}
              </p>
              <button
                type="submit"
                className="qvm-btn qvm-btn-primary"
                disabled={!hora || status === "sending"}
              >
                {status === "sending" ? "Agendando..." : "Agendar reunión"}
              </button>
              {status === "error" && (
                <p className="ag-msg is-error">
                  No pudimos agendar la reunión. Probá de nuevo o escribinos por WhatsApp.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
