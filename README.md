# VideoCallShop — quierovendermas.com.ar

Landing de **VideoCallShop** (live shopping por videollamada) publicada en
**https://quierovendermas.com.ar**. Hecha en React; el formulario guarda los
leads en Supabase y avisa por mail.

## Estructura

```
├── .github/workflows/deploy.yml   ← publica sola en GitHub Pages en cada push
├── public/
│   ├── CNAME                      ← dominio propio (quierovendermas.com.ar)
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Landing.jsx            ← toda la página (textos editables arriba de todo)
│   │   └── Landing.css            ← estilos (colores en :root)
│   ├── App.jsx
│   ├── index.js
│   └── supabaseClient.js
├── .env.example
└── package.json
```

## Editar textos rápido

Al principio de `src/components/Landing.jsx` están todas las constantes:
`WHATSAPP_NUMBER`, `CONTACT_EMAIL`, `BENEFICIOS`, `PASOS`, `PERFILES`, `FAQS`
e `INTEGRACIONES` (la cinta animada de medios de pago/envío — dejá solo las
que realmente uses).

Los colores se cambian en `src/components/Landing.css`, en el bloque `:root`.

---

## Paso 1 — Subir a GitHub

1. Creá un repositorio nuevo en GitHub (ej: `quierovendermas`).
2. Subí **todo el contenido de esta carpeta** (incluida la carpeta oculta `.github`):
   ```bash
   git init
   git add .
   git commit -m "Nueva web VideoCallShop"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/quierovendermas.git
   git push -u origin main
   ```
   > Si lo subís arrastrando archivos desde la web de GitHub, asegurate de que
   > se suba también `.github/workflows/deploy.yml`.

## Paso 2 — Cargar las claves de Supabase como "secrets"

En el repo: **Settings → Secrets and variables → Actions → New repository secret**.
Creá estos dos (los valores están en Supabase → Settings → API):

| Nombre | Valor |
|---|---|
| `REACT_APP_SUPABASE_URL` | Project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | anon public key |

⚠️ Nunca uses la clave `service_role`.

Si todavía no tenés la tabla `leads`, corré esto en el **SQL Editor** de Supabase:

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  negocio text not null,
  rubro text not null,
  whatsapp text not null,
  created_at timestamp with time zone default now()
);
alter table leads enable row level security;
create policy "Cualquiera puede insertar leads"
  on leads for insert to anon with check (true);
```

## Paso 3 — Activar GitHub Pages

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Andá a la pestaña **Actions**: vas a ver "Deploy a GitHub Pages" corriendo.
   Cuando termina en verde, la web ya está publicada.
3. En **Settings → Pages → Custom domain** escribí `quierovendermas.com.ar` y guardá.
   Cuando el DNS esté listo (Paso 4), tildá **Enforce HTTPS**.

Cada vez que hagas un cambio y un `git push`, la web se actualiza sola.

## Paso 4 — Apuntar el dominio .com.ar a GitHub

NIC Argentina no permite cargar registros DNS directamente: hay que **delegar**
el dominio a un proveedor de DNS. La opción gratis más simple es **Cloudflare**.

1. Creá una cuenta en [cloudflare.com](https://cloudflare.com) → *Add a site* →
   `quierovendermas.com.ar` → plan Free. Cloudflare te da **2 nameservers**.
2. En [nic.ar](https://nic.ar) → tu dominio → **Delegaciones** → borrá las que
   haya y cargá los 2 nameservers de Cloudflare.
3. En Cloudflare → **DNS → Records**, cargá:

   | Tipo | Nombre | Valor | Proxy |
   |---|---|---|---|
   | A | `@` | `185.199.108.153` | DNS only (nube gris) |
   | A | `@` | `185.199.109.153` | DNS only |
   | A | `@` | `185.199.110.153` | DNS only |
   | A | `@` | `185.199.111.153` | DNS only |
   | CNAME | `www` | `TU-USUARIO.github.io` | DNS only |

4. La propagación puede tardar de minutos a 24-48 h. Después volvé al Paso 3 y
   activá **Enforce HTTPS**.

## Agenda de reuniones (martes y jueves de 14 a 19 h)

La sección **"Agendá una reunión"** (`src/components/Agenda.jsx`) guarda cada reserva en
Supabase y te avisa por mail. Para activarla, una sola vez:

1. En Supabase → **SQL Editor**, pegá el contenido de `supabase/reuniones.sql` y tocá **Run**.
2. Listo. Las reuniones se ven en **Table Editor → reuniones**.

Qué hace el script:
- Crea la tabla `reuniones` (fecha, hora, nombre, teléfono, mail, empresa, interés).
- No deja reservar dos veces el mismo día y horario.
- La web solo puede ver **qué horarios están ocupados**, nunca los datos de las personas.

Para cambiar días, horarios, duración o bloquear feriados, editá las constantes al
principio de `src/components/Agenda.jsx` (`DIAS_DISPONIBLES`, `HORA_INICIO`, `HORA_FIN`,
`DURACION_MIN`, `FECHAS_BLOQUEADAS`).

## Mails de la agenda

**Confirmación al cliente (inmediata):** al agendar, FormSubmit te manda el aviso a vos y
una respuesta automática al mail del cliente con el día y la hora. La primera vez,
FormSubmit te manda un mail para **activar** el formulario: hacé clic en el link.

**Recordatorio un día antes:** lo envía GitHub Actions todos los días a las 10:00
(`.github/workflows/recordatorios.yml` + `scripts/recordatorios/enviar.mjs`).
Configuración, una sola vez:

1. Supabase → SQL Editor → corré de nuevo `supabase/reuniones.sql` (agrega la columna `recordatorio_enviado`).
2. Supabase → Project Settings → API Keys → **Secret keys** → creá una clave nueva (`sb_secret_...`).
3. Gmail → myaccount.google.com → Seguridad → activá la verificación en 2 pasos →
   **Contraseñas de aplicaciones** → creá una (16 letras).
4. GitHub → Settings → Secrets and variables → Actions → agregá:
   - `SUPABASE_SECRET_KEY` = la clave `sb_secret_...` (solo acá, **nunca** en `REACT_APP_...`)
   - `GMAIL_USER` = la cuenta de Gmail que envía
   - `GMAIL_APP_PASSWORD` = la contraseña de aplicación
5. Probalo: Actions → "Recordatorios de reuniones" → Run workflow (con `dry_run` = 1 solo muestra, sin enviar).

## Probar en tu compu (opcional)

```bash
cp .env.example .env     # y completá las dos claves
npm install
npm start
```

## Notas de seguridad

- El `.env` no se sube al repo (está en `.gitignore`); en GitHub las claves van como *secrets*.
- La política de Supabase permite solo **insertar**, no leer: nadie puede ver los leads desde el navegador.
- Los leads se ven en Supabase → **Table Editor → leads** (exportable a CSV).
