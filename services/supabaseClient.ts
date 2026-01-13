
import { createClient } from '@supabase/supabase-js';

// Tenta obter das variáveis de ambiente do Vite, caso existam no Vercel/Ambiente de Build
// @ts-ignore
const env = (import.meta as any).env || {};

const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://qahsrzsbdqlehckhcisb.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaHNyenNiZHFsZWhja2hjaXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjE4MDUsImV4cCI6MjA4MDg5NzgwNX0.4PV2r5X2utxJ2AazhK72Fp0MaxouDBJ-6kDYPJjd1lE';

if (!env.VITE_SUPABASE_URL && !SUPABASE_URL) {
    console.error("ERRO: SUPABASE_URL não encontrada no ambiente.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
