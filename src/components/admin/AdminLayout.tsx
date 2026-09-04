import React from 'react';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  Tags,
  Rss,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Quote,
} from 'lucide-react';
import { AdelinaLogo } from '../public/AdelinaLogo';

interface AdminLayoutProps {
  currentTab: string;
  onNavigateTab: (tab: string, param?: string) => void;
  onLogout: () => void;
  onViewWeb: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigateTab,
  onLogout,
  onViewWeb,
  children,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Inmuebles', icon: Building2 },
    { id: 'property-new', label: 'Nueva Propiedad', icon: PlusCircle },
    { id: 'categories', label: 'Categorías', icon: Tags },
    { id: 'testimonials', label: 'Testimonios', icon: Quote },
    { id: 'leads', label: 'Consultas & Leads', icon: MessageSquare },
    { id: 'xml-feed', label: 'Feeds Portales (XML)', icon: Rss },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row text-zinc-800">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-adelina-dark text-white flex flex-col justify-between shrink-0 border-r border-zinc-800">
        <div>
          {/* Top Logo & Title */}
          <div className="p-6 border-b border-zinc-800 flex flex-col space-y-2">
            <AdelinaLogo className="h-5 w-auto text-white" />
            <span className="text-[10px] text-zinc-400 font-light block uppercase tracking-wider">
              Panel de Gestión
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
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
          <button
            onClick={onViewWeb}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-adelina-accent" />
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
    </div>
  );
};
