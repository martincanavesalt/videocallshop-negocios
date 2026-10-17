import { createClient } from "@supabase/supabase-js";

// Estas dos variables se cargan desde el archivo .env (local) o desde los
// "secrets" del repo en GitHub (Settings -> Secrets and variables -> Actions).
// Nunca pongas acá la clave "service_role" de Supabase, solo la "anon public".
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Si faltan las claves, la web se muestra igual; solo el formulario no guarda.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!supabase) {
  console.warn(
    "Faltan REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY: el formulario no va a guardar leads."
  );
}
