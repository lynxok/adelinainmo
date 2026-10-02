import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  Tags,
  Rss,
  LogOut,
  ExternalLink,
  KeyRound,
  Quote,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  X,
  Loader2,
  Users,
} from 'lucide-react';
import { AdelinaLogo } from '../public/AdelinaLogo';
import { UserProfile } from '../../types/property';
import { authService } from '../../lib/supabase';

interface AdminLayoutProps {
  currentTab: string;
  onNavigateTab: (tab: string, param?: string) => void;
  onLogout: () => void;
  onViewWeb: () => void;
  userProfile?: UserProfile | null;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigateTab,
  onLogout,
  onViewWeb,
  userProfile,
  children,
}) => {
  const isSuperadmin = userProfile?.role === 'superadmin';

  // Navigation Items according to RBAC
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, superadminOnly: true },
    { id: 'properties', label: 'Inmuebles', icon: Building2, superadminOnly: false },
    { id: 'property-new', label: 'Nueva Propiedad', icon: PlusCircle, superadminOnly: false },
    { id: 'categories', label: 'Categorías', icon: Tags, superadminOnly: true },
    { id: 'testimonials', label: 'Testimonios', icon: Quote, superadminOnly: true },
    { id: 'leads', label: 'Consultas & Leads', icon: MessageSquare, superadminOnly: true },
    { id: 'users', label: 'Usuarios CRM', icon: Users, superadminOnly: true },
    { id: 'xml-feed', label: 'Feeds Portales (XML)', icon: Rss, superadminOnly: true },
  ];

  const visibleNavItems = allNavItems.filter(
    (item) => !item.superadminOnly || isSuperadmin
  );

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword.length < 6) {
      setPassMsg({ text: 'La contraseña debe tener al menos 6 caracteres.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ text: 'Las contraseñas no coinciden.', type: 'error' });
      return;
    }

    setPassLoading(true);
    try {
      await authService.updatePassword(newPassword);
      setPassMsg({ text: '¡Contraseña actualizada con éxito!', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassMsg(null);
      }, 2000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setPassMsg({ text: err.message || 'Error al actualizar contraseña.', type: 'error' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row text-zinc-800">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-adelina-dark text-white flex flex-col justify-between shrink-0 border-r border-zinc-800">
        <div>
          {/* Top Logo & Title */}
          <div className="p-6 border-b border-zinc-800 flex flex-col space-y-2">
            <AdelinaLogo className="h-5 w-auto text-white" />
            <span className="text-[10px] text-zinc-400 font-light block uppercase tracking-wider">
              Panel Inmobiliario
            </span>

            {/* Active User Badge */}
            {userProfile && (
              <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-zinc-200 truncate">
                    {userProfile.full_name || userProfile.email}
                  </p>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>{userProfile.role === 'superadmin' ? 'Superadmin' : 'Corredor'}</span>
                  </p>
                </div>
                <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                  userProfile.role === 'superadmin' ? 'bg-amber-400/20 text-amber-300' : 'bg-blue-400/20 text-blue-300'
                }`}>
                  {userProfile.role === 'superadmin' ? 'Admin' : 'Venta'}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'properties' && currentTab === 'property-edit');
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-adelina-accent text-adelina-dark font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {/* Change Password Button */}
          <button
            onClick={() => {
              setShowPasswordModal(true);
              setPassMsg(null);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-adelina-accent" />
            <span>Cambiar Contraseña</span>
          </button>

          <button
            onClick={onViewWeb}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-zinc-400" />
            <span>Ver Sitio Web</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        {children}
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-adelina-sand text-adelina-dark flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-archivo text-base font-bold text-zinc-900">
                    Cambiar Mi Contraseña
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {userProfile?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passMsg && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                passMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {passMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-adelina-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repetí la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-adelina-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={passLoading}
                  className="bg-adelina-dark hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {passLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar Contraseña</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
