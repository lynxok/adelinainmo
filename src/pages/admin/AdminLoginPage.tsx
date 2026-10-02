import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { AdelinaLogo } from '../../components/public/AdelinaLogo';
import { authService } from '../../lib/supabase';
import { UserProfile } from '../../types/property';

interface AdminLoginPageProps {
  onLoginSuccess: (profile?: UserProfile) => void;
  onBackToWeb: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToWeb }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completá usuario y contraseña.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { profile } = await authService.login(email, password);
      onLoginSuccess(profile || undefined);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Credenciales incorrectas. Verificá tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-adelina-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-zinc-200 space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-2">
            <AdelinaLogo className="h-6 w-auto text-zinc-900" />
          </div>
          <h1 className="font-archivo text-xl font-bold text-adelina-dark">
            Panel Inmobiliario
          </h1>
          <p className="text-xs text-zinc-500 font-light">
            Ingreso exclusivo para gestión de catálogo, clientes y consultas
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="ejemplo@adelinainmobiliaria.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-adelina-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-adelina-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-adelina-dark hover:bg-black text-white font-medium py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-adelina-accent" />
            ) : (
              <>
                <span>Ingresar al Panel</span>
                <ArrowRight className="w-4 h-4 text-adelina-accent" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onBackToWeb}
            className="w-full text-center text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            ← Volver a la web pública
          </button>
        </div>
      </div>
    </div>
  );
};
