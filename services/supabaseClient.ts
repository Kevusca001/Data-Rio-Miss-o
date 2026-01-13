import { createClient } from '@supabase/supabase-js';

// Pega as variáveis que você configurou lá na Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as chaves não existirem, o site vai avisar com um POP-UP na tela (impossível não ver)
if (!supabaseUrl || !supabaseAnonKey) {
  alert("ERRO CRÍTICO: As chaves do Supabase não foram encontradas na Vercel!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);