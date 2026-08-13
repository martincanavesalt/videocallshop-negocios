# VideoCallShop — Landing Negocios (con base de datos)

App React que captura leads de negocios y los guarda en una base de datos
gratuita (Supabase, Postgres).

## Estructura
```
├── public/index.html
├── src/
│   ├── components/
│   │   ├── LandingNegocios.jsx
│   │   └── LandingNegocios.css
│   ├── App.jsx
│   ├── index.js
│   └── supabaseClient.js
├── .env.example
├── package.json
└── .gitignore
```

## Paso 1 — Crear la base de datos gratis en Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta gratis.
2. Creá un proyecto nuevo (el plan Free alcanza de sobra para esto).
3. Una vez creado, andá a **SQL Editor** (menú izquierdo) y corré esto para crear la tabla de leads:

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  negocio text not null,
  rubro text not null,
  whatsapp text not null,
  created_at timestamp with time zone default now()
);

-- Habilitar seguridad a nivel de fila
alter table leads enable row level security;

-- Permitir que cualquiera pueda INSERTAR (enviar el formulario),
-- pero nadie pueda LEER los datos desde el navegador (eso protege los leads).
create policy "Cualquiera puede insertar leads"
  on leads for insert
  to anon
  with check (true);
```

4. Andá a **Settings → API**. Ahí vas a ver:
   - **Project URL** → esto va en `REACT_APP_SUPABASE_URL`
   - **anon public key** → esto va en `REACT_APP_SUPABASE_ANON_KEY`

   ⚠️ Usá siempre la clave **anon public**, nunca la `service_role` (esa es secreta y no debe estar en el frontend).

## Paso 2 — Configurar el proyecto local

1. Copiá `.env.example` como `.env` y completá con los dos valores de arriba.
2. En `package.json`, reemplazá la línea `homepage` con tu usuario y el nombre real del repo:
   ```json
   "homepage": "https://TU-USUARIO.github.io/NOMBRE-DEL-REPO"
   ```
3. Instalá dependencias:
   ```bash
   npm install
   ```
4. Probá local:
   ```bash
   npm start
   ```

## Paso 3 — Ver los leads que van llegando

En Supabase, andá a **Table Editor → leads**. Ahí vas a ver cada envío del formulario en tiempo real, exportable a CSV cuando quieras.

## Paso 4 — Publicar en GitHub Pages

⚠️ Importante: como GitHub Pages es hosting estático, las variables de entorno se "hornean" dentro del build en tu compu — por eso el `.env` tiene que existir **antes** de correr `npm run deploy`.

```bash
npm run deploy
```

Después, en GitHub → Settings → Pages, seleccioná la rama `gh-pages`, carpeta `/ (root)`.

## Notas de seguridad

- El `.env` **no se sube al repo** (está en `.gitignore`) porque, aunque la clave `anon` está pensada para ser pública, no tiene sentido versionarla.
- La política de Supabase que creamos permite *solo insertar*, no leer — así que aunque alguien vea la clave `anon` en el código del navegador (es visible, es normal), no puede consultar los leads de otros negocios.

## WhatsApp
Botón flotante y botón del hero apuntan a `+54 9 3341 5858527`. Para cambiarlo: constante `WHATSAPP_NUMBER` en `LandingNegocios.jsx`.
