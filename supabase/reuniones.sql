-- Agenda de reuniones de VideoCallShop
-- Pegá todo esto en Supabase -> SQL Editor -> Run (una sola vez).

create table if not exists reuniones (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  hora time not null,
  nombre text not null,
  telefono text not null,
  email text not null,
  empresa text not null,
  interes text not null,
  created_at timestamp with time zone default now(),
  -- impide que dos personas reserven el mismo día y horario
  constraint reuniones_fecha_hora_unica unique (fecha, hora)
);

alter table reuniones enable row level security;

-- Cualquiera puede reservar (insertar), pero nadie puede leer los datos desde la web.
drop policy if exists "Cualquiera puede agendar" on reuniones;
create policy "Cualquiera puede agendar"
  on reuniones for insert
  to anon
  with check (true);

-- La web solo puede consultar QUÉ horarios están ocupados (fecha y hora),
-- nunca los datos de las personas.
create or replace function horarios_ocupados(desde date, hasta date)
returns table (fecha date, hora time)
language sql
security definer
set search_path = public
as $$
  select r.fecha, r.hora from reuniones r
  where r.fecha between desde and hasta;
$$;

grant execute on function horarios_ocupados(date, date) to anon;

-- Recordatorios: marca qué reuniones ya recibieron el aviso del día anterior
alter table reuniones add column if not exists recordatorio_enviado boolean not null default false;

-- Formulario nuevo (oct 2026): nombre, negocio, rubro, WhatsApp y mail opcional.
-- "empresa" guarda el negocio y "telefono" el WhatsApp.
alter table reuniones add column if not exists rubro text;
alter table reuniones add column if not exists plan text;
alter table reuniones alter column email drop not null;
alter table reuniones alter column interes drop not null;
