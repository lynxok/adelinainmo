import React from 'react';
import { ReviewPlatform } from '../../types/testimonial';

export interface PlatformConfig {
  id: ReviewPlatform;
  label: string;
  badgeLabel: string;
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
}

export const PLATFORM_OPTIONS: { id: ReviewPlatform; label: string; description: string }[] = [
  { id: 'google', label: 'Google', description: 'Reseña de Google Maps / Business' },
  { id: 'instagram', label: 'Instagram', description: 'Comentario / DM de Instagram' },
  { id: 'facebook', label: 'Facebook', description: 'Opinión de Facebook' },
  { id: 'whatsapp', label: 'WhatsApp', description: 'Mensaje de WhatsApp' },
  { id: 'zonaprop', label: 'ZonaProp', description: 'Consulta en ZonaProp' },
  { id: 'web', label: 'Web Directa', description: 'Testimonio directo en la web' },
];

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export const ZonaPropIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3zm0 2.84L18 11.2V18h-2v-5H8v5H6v-6.8L12 5.84z" />
  </svg>
);

export const WebIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

interface ReviewAvatarProps {
  platform?: ReviewPlatform;
  avatarUrl?: string;
  clientName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ReviewAvatar: React.FC<ReviewAvatarProps> = ({
  platform = 'google',
  avatarUrl,
  clientName = 'Cliente',
  size = 'md',
  className = '',
}) => {
  const normPlatform: ReviewPlatform = platform || 'google';

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  // If user provided a custom photo, display the photo with a tiny corner badge
  if (avatarUrl) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full rounded-full border-[3px] border-white shadow-sm overflow-hidden bg-zinc-100">
          <img src={avatarUrl} alt={clientName} className="w-full h-full object-cover" />
        </div>
        {/* Tiny platform badge on corner */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white shadow flex items-center justify-center p-0.5 border border-zinc-100">
          {normPlatform === 'google' && <GoogleIcon className="w-3 h-3" />}
          {normPlatform === 'instagram' && (
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white">
              <InstagramIcon className="w-2.5 h-2.5" />
            </div>
          )}
          {normPlatform === 'facebook' && (
            <div className="w-full h-full rounded-full bg-[#1877F2] flex items-center justify-center text-white">
              <FacebookIcon className="w-2.5 h-2.5" />
            </div>
          )}
          {normPlatform === 'whatsapp' && (
            <div className="w-full h-full rounded-full bg-[#25D366] flex items-center justify-center text-white">
              <WhatsAppIcon className="w-2.5 h-2.5" />
            </div>
          )}
          {normPlatform === 'zonaprop' && (
            <div className="w-full h-full rounded-full bg-[#E0592A] flex items-center justify-center text-white">
              <ZonaPropIcon className="w-2.5 h-2.5" />
            </div>
          )}
          {normPlatform === 'web' && (
            <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-[#CCA352]">
              <WebIcon className="w-2.5 h-2.5" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Direct signature brand styling according to platform
  switch (normPlatform) {
    case 'google':
      return (
        <div
          className={`${sizeClasses[size]} rounded-full bg-white border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-105 ${className}`}
          title="Reseña verificada de Google"
        >
          <GoogleIcon className={iconSizes[size]} />
        </div>
      );

    case 'instagram':
      return (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden text-white transition-transform duration-200 hover:scale-105 ${className}`}
          title="Comentario de Instagram"
        >
          <InstagramIcon className={iconSizes[size]} />
        </div>
      );

    case 'facebook':
      return (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#1877F2] border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden text-white transition-transform duration-200 hover:scale-105 ${className}`}
          title="Opinión de Facebook"
        >
          <FacebookIcon className={iconSizes[size]} />
        </div>
      );

    case 'whatsapp':
      return (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#25D366] border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden text-white transition-transform duration-200 hover:scale-105 ${className}`}
          title="Mensaje de WhatsApp"
        >
          <WhatsAppIcon className={iconSizes[size]} />
        </div>
      );

    case 'zonaprop':
      return (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#E0592A] border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden text-white transition-transform duration-200 hover:scale-105 ${className}`}
          title="Consulta en ZonaProp"
        >
          <ZonaPropIcon className={iconSizes[size]} />
        </div>
      );

    case 'web':
    default:
      return (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#1F2937] border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden text-[#CCA352] transition-transform duration-200 hover:scale-105 ${className}`}
          title="Testimonio Web Adelina"
        >
          <WebIcon className={iconSizes[size]} />
        </div>
      );
  }
};
