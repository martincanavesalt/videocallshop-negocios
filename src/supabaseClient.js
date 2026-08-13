import { createClient } from "@supabase/supabase-js";

// Estas dos variables se cargan desde el archivo .env (ver .env.example).
// Nunca pongas acá la clave "service_role" de Supabase, solo la "anon public".
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Faltan las variables REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY. Revisá tu archivo .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
