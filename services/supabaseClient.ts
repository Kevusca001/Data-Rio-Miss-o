
import { createClient } from '@supabase/supabase-js';

/**
 * DETECTION DE AMBIENTE VITE / VERCEL
 * Tentamos obter as variáveis de import.meta.env ou process.env dependendo do bundler.
 */

let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  // @ts-ignore
  supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
  // @ts-ignore
  supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
} catch (e) {
  console.warn("import.meta.env não disponível, tentando fallback.");
}

// Fallback manual para as chaves conhecidas se o build falhar em injetar (Último recurso)
if (!supabaseUrl || !supabaseAnonKey) {
  console.log("Variáveis de ambiente VITE_ não encontradas. Usando fallbacks codificados.");
  supabaseUrl = 'https://qahsrzsbdqlehckhcisb.supabase.co';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaHNyenNiZHFsZWhja2hjaXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjE4MDUsImV4cCI6MjA4MDg5NzgwNX0.4PV2r5X2utxJ2AazhK72Fp0MaxouDBJ-6kDYPJjd1lE';
}

console.log("Iniciando Supabase com URL:", supabaseUrl ? "Presente" : "AUSENTE");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
