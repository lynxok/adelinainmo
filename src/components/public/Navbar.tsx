import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, ShieldCheck, ChevronDown } from 'lucide-react';
import { ADELINA_PHONE_FORMATTED, getWhatsAppGeneralUrl } from '../../lib/whatsappUtils';
import { AdelinaLogo } from './AdelinaLogo';
import { categoryService } from '../../lib/supabase';
import { PropertyCategory } from '../../types/property';

interface NavbarProps {
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(true);
  const [categories, setCategories] = useState<PropertyCategory[]>(() => categoryService.getCategories());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCategories = () => {
      setCategories(categoryService.getCategories());
    };
    window.addEventListener('adelina-categories-changed', updateCategories);
    return () => window.removeEventListener('adelina-categories-changed', updateCategories);
  }, []);

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || currentView === 'detail'
          ? 'bg-[#303030]/95 backdrop-blur-md text-white py-3.5 shadow-md border-b border-white/10'
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
        <nav className="hidden md:flex items-center gap-8 font-archivo text-sm font-normal">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-adelina-accent transition-colors ${currentView === 'home' ? 'text-adelina-accent font-medium' : 'text-zinc-200'}`}
          >
            Inicio
          </button>

          {/* Propiedades Dropdown Button */}
          <div
            ref={dropdownRef}
            className="relative py-2"
            onMouseEnter={() => setDesktopDropdownOpen(true)}
            onMouseLeave={() => setDesktopDropdownOpen(false)}
          >
            <button
              onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
              className={`inline-flex items-center gap-1.5 hover:text-adelina-accent transition-colors ${
                currentView === 'catalog' ? 'text-adelina-accent font-medium' : 'text-zinc-200'
              }`}
              aria-haspopup="true"
              aria-expanded={desktopDropdownOpen}
            >
              <span>Propiedades</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  desktopDropdownOpen ? 'rotate-180 text-adelina-accent' : 'text-zinc-400'
                }`}
              />
            </button>

            {/* Desktop Dropdown Menu */}
            {desktopDropdownOpen && (
              <div className="absolute top-full left-0 pt-1 z-50">
                <div className="w-56 rounded-2xl bg-adelina-dark/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2 overflow-hidden animate-fadeIn">
                  <div className="px-4 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest border-b border-white/5">
                    Categorías
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate('buy-sell', `category:${cat.slug}`);
                        setDesktopDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-zinc-200 hover:text-adelina-accent hover:bg-white/5 transition-all flex items-center justify-between group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                      <span className="text-[10px] text-zinc-500 group-hover:text-adelina-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={() => {
                      onNavigate('buy-sell');
                      setDesktopDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-adelina-accent hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <span>Ver todas las propiedades</span>
                    <span className="text-[10px]">Catálogo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('buy-sell')}
            className={`hover:text-adelina-accent transition-colors ${
              currentView === 'buy-sell' ? 'text-adelina-accent font-medium' : 'text-zinc-200'
            }`}
          >
            Comprar y Vender
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
        <div className="md:hidden bg-adelina-dark/98 border-b border-zinc-800 px-6 py-6 space-y-4 text-white animate-fadeIn max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-lg border-b border-zinc-800"
          >
            Inicio
          </button>

          {/* Mobile Accordion for Propiedades */}
          <div className="border-b border-zinc-800 pb-2">
            <button
              onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
              className="flex items-center justify-between w-full text-left py-2 text-lg text-white"
            >
              <span>Propiedades</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${mobileAccordionOpen ? 'rotate-180 text-adelina-accent' : 'text-zinc-400'}`} />
            </button>

            {mobileAccordionOpen && (
              <div className="pl-3 pb-2 space-y-2 pt-1 border-l border-adelina-accent/40 ml-2 mt-1">
                <button
                  onClick={() => {
                    onNavigate('buy-sell');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-1 text-sm font-medium text-adelina-accent"
                >
                  • Todas las propiedades
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onNavigate('buy-sell', `category:${cat.slug}`);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1.5 text-sm text-zinc-300 hover:text-white"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onNavigate('buy-sell');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 text-lg border-b border-zinc-800 ${
              currentView === 'buy-sell' ? 'text-adelina-accent font-medium' : 'text-zinc-200'
            }`}
          >
            Comprar y Vender
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
