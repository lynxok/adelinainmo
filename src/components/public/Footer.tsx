import React from 'react';

interface FooterProps {
  onNavigate?: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="contacto" className="bg-[#141414] text-zinc-300 pt-20 pb-12 px-4 sm:px-6 lg:px-16 border-t border-zinc-900 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          {/* Left Column: Official Vector AL Monogram from Links/Recurso 2.svg */}
          <div className="md:col-span-4 flex items-center justify-center md:justify-start">
            <img
              src="/assets/al-monogram-footer.svg"
              alt="Adelina Luján Isotipo AL"
              className="w-36 sm:w-44 md:w-52 h-auto object-contain"
            />
          </div>

          {/* Middle Column: WhatsApp & Instagram */}
          <div className="md:col-span-4 space-y-7 text-left">
            <div className="space-y-1">
              <span className="text-zinc-400 block font-archivo text-xs tracking-wider">WhatsApp:</span>
              <a
                href="https://wa.me/5493433001534"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-adelina-accent transition-colors block font-archivo text-base sm:text-lg font-normal tracking-wide"
              >
                343 300 1 534
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-400 block font-archivo text-xs tracking-wider">Instagram:</span>
              <a
                href="https://instagram.com/adelinalujan.propiedades"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-adelina-accent transition-colors block font-archivo text-base sm:text-lg font-normal tracking-wide"
              >
                @adelinalujan.propiedades
              </a>
            </div>
          </div>

          {/* Right Column: Email & Location */}
          <div className="md:col-span-4 space-y-7 text-left">
            <div className="space-y-1">
              <span className="text-zinc-400 block font-archivo text-xs tracking-wider">Email:</span>
              <a
                href="mailto:adelinalujan93@gmail.com"
                className="text-white hover:text-adelina-accent transition-colors block font-archivo text-base sm:text-lg font-normal tracking-wide"
              >
                adelinalujan93@gmail.com
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-400 block font-archivo text-xs tracking-wider invisible select-none" aria-hidden="true">
                &nbsp;
              </span>
              <span className="text-zinc-300 block font-archivo text-xs sm:text-sm font-light min-h-[24px] sm:min-h-[28px] flex items-center">
                Paraná, Entre Ríos, Argentina - 2026
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Credits Bar with Bardo and 50% larger LYNX Logo linked to lnx.com.ar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] sm:text-xs text-zinc-400 font-light">
          <div className="flex items-center gap-3.5 flex-wrap">
            <span>Sitio web diseñado por</span>
            <a
              href="https://marianacurto.myportfolio.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Mariana Curto - Bardo Branding & Design"
              className="inline-flex items-center hover:opacity-100 transition-opacity group"
            >
              <img
                src="/assets/bardo-logo.svg"
                alt="Bardo"
                className="h-3.5 sm:h-4 w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
              />
            </a>
            <span className="ml-1">y desarrollado por</span>
            <a
              href="https://www.lnx.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              title="LYNX - Software & AI Solutions"
              className="inline-flex items-center hover:opacity-100 transition-opacity group"
            >
              <img
                src="/assets/lynx-logo-white.png"
                alt="LYNX"
                className="h-10 sm:h-12 w-auto object-contain opacity-95 group-hover:scale-105 transition-transform"
              />
            </a>
          </div>

          <p>
            Copyright © 2026 | <span className="hover:text-zinc-300 cursor-pointer">Política de privacidad</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
