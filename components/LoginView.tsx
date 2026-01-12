import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ShieldCheck, Lock, Mail, ArrowLeft, Loader } from 'lucide-react';

interface LoginViewProps {
    onLoginSuccess: () => void;
    onCancel: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onCancel }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                onLoginSuccess();
            }
        } catch (err: any) {
            setError(err.message || "Falha ao autenticar. Verifique suas credenciais.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-nexus-black flex flex-col items-center justify-center p-4">
            
            <button 
                onClick={onCancel}
                className="absolute top-6 left-6 text-nexus-muted hover:text-white flex items-center gap-2 transition-colors"
            >
                <ArrowLeft size={20} />
                Voltar
            </button>

            <div className="w-full max-w-md bg-nexus-panel border border-nexus-border rounded-xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                <img
                      src="https://qahsrzsbdqlehckhcisb.supabase.co/storage/v1/object/sign/Imagens/Logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YmMxNDkwZC04Njg1LTRlMWMtYTNlYi0zMDE2MTUzNzQ5NGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZW5zL0xvZ28uanBnIiwiaWF0IjoxNzY1MzI4OTE5LCJleHAiOjE3OTY4NjQ5MTl9.N6yAhNSF3wdqDHj5STcG8I3Lilk3UBkbfHNtZU3XGj0"
                      alt="Logo Data Rio Missão"
                      style={{ width: 200, margin: "0 auto 24px", display: "block", borderRadius: 8 }}
                />

                    
                    <h2 className="text-2xl font-bold text-white">Área do Publicador</h2>
                    <p className="text-nexus-muted text-sm mt-2 text-center">
                        Acesso restrito a administradores do Data Rio Missão.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs text-nexus-muted uppercase font-semibold pl-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-nexus-muted" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-nexus-black border border-nexus-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-nexus-yellow transition-colors"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-nexus-muted uppercase font-semibold pl-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-nexus-muted" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-nexus-black border border-nexus-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-nexus-yellow transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-nexus-yellow text-black font-bold py-3 rounded-lg hover:bg-nexus-yellowHover transition-colors mt-6 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader size={18} className="animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            "Acessar Painel"
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-nexus-border text-center">
                    <p className="text-xs text-nexus-muted">
                        Problemas com acesso? Contate o suporte técnico.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;