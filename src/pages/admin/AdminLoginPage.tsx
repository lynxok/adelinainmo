import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

import { AdelinaLogo } from '../../components/public/AdelinaLogo';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToWeb: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToWeb }) => {
  const [email, setEmail] = useState('adelina@inmobiliaria.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master access for local/in-house management
    if (email && password) {
      localStorage.setItem('adelina_admin_auth', 'true');
      onLoginSuccess();
    } else {
      setError('Por favor completá usuario y contraseña');
    }
  };

  const handleQuickDemoAccess = () => {
    localStorage.setItem('adelina_admin_auth', 'true');
    onLoginSuccess();
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
            Gestión de propiedades, fichas para colegas y consultas
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-adelina-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-adelina-dark hover:bg-black text-white font-medium py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>Ingresar al Panel</span>
            <ArrowRight className="w-4 h-4 text-adelina-accent" />
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-100 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="w-full bg-adelina-sand/80 hover:bg-adelina-sand text-adelina-dark font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-adelina-border"
          >
            <Sparkles className="w-4 h-4 text-adelina-gold" />
            <span>Acceso Rápido Administrador</span>
          </button>

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
