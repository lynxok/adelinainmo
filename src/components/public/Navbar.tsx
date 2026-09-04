import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, UserCheck, ShieldCheck } from 'lucide-react';
import { ADELINA_PHONE_FORMATTED, getWhatsAppGeneralUrl } from '../../lib/whatsappUtils';
import { AdelinaLogo } from './AdelinaLogo';

interface NavbarProps {
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-adelina-dark/95 backdrop-blur-md text-white py-3.5 shadow-lg border-b border-white/10'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo (Figma 1:1 format: adelina lujan + asesoramiento inmobiliario) */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-left group focus:outline-none hover:opacity-90 transition-opacity"
          aria-label="adelina lujan - asesoramiento inmobiliario"
        >
          <AdelinaLogo className="h-5 sm:h-6 md:h-7 w-auto text-white" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-poppins text-sm font-normal">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-adelina-accent transition-colors ${currentView === 'home' ? 'text-adelina-accent font-medium' : 'text-zinc-200'}`}
          >
            Inicio
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className={`hover:text-adelina-accent transition-colors ${currentView === 'catalog' ? 'text-adelina-accent font-medium' : 'text-zinc-200'}`}
          >
            Propiedades
          </button>
          <button
            onClick={() => onNavigate('catalog', 'operation:sale')}
            className="hover:text-adelina-accent transition-colors text-zinc-200"
          >
            Comprar
          </button>
          <button
            onClick={() => onNavigate('valuation')}
            className="hover:text-adelina-accent transition-colors text-zinc-200"
          >
            Vender / Tasaciones
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`hover:text-adelina-accent transition-colors ${currentView === 'about' ? 'text-adelina-accent font-medium' : 'text-zinc-200'}`}
          >
            Sobre Adelina
          </button>
        </nav>

        {/* CTA Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={getWhatsAppGeneralUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-adelina-accent hover:bg-adelina-gold text-adelina-dark font-medium px-4 py-2 rounded-full text-xs transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{ADELINA_PHONE_FORMATTED}</span>
          </a>

          <button
            onClick={() => onNavigate('admin')}
            title="Panel Inmobiliario Privado"
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => onNavigate('admin')}
            className="text-zinc-300 p-2"
            title="Panel Admin"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-adelina-dark/98 border-b border-zinc-800 px-6 py-6 space-y-4 text-white animate-fadeIn">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-lg border-b border-zinc-800"
          >
            Inicio
          </button>
          <button
            onClick={() => { onNavigate('catalog'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-lg border-b border-zinc-800"
          >
            Ver Propiedades
          </button>
          <button
            onClick={() => { onNavigate('catalog', 'operation:sale'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-lg border-b border-zinc-800"
          >
            Comprar
          </button>
          <button
            onClick={() => { onNavigate('valuation'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-lg border-b border-zinc-800"
          >
            Vender / Tasar Propiedad
          </button>
          <button
            onClick={() => { 
              onNavigate('about'); 
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 text-lg border-b border-zinc-800 ${currentView === 'about' ? 'text-adelina-accent font-medium' : 'text-zinc-200'}`}
          >
            Sobre Adelina
          </button>
          <div className="pt-2">
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-adelina-accent text-adelina-dark font-medium py-3 rounded-xl text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
