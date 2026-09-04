import React, { useState, useEffect } from 'react';
import { Testimonial, ReviewPlatform } from '../../types/testimonial';
import { testimonialService } from '../../lib/supabase';
import {
  ReviewAvatar,
  PLATFORM_OPTIONS,
  GoogleIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  ZonaPropIcon,
  WebIcon
} from '../../components/public/ReviewAvatar';
import {
  Star,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Quote,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => testimonialService.getTestimonials());
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [date, setDate] = useState('');
  const [platform, setPlatform] = useState<ReviewPlatform>('google');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = () => {
    setTestimonials(testimonialService.getTestimonials());
  };

  useEffect(() => {
    window.addEventListener('adelina-testimonials-changed', loadData);
    return () => window.removeEventListener('adelina-testimonials-changed', loadData);
  }, []);

  const activeCount = testimonials.filter(t => t.is_active).length;
  const avgRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  const handleOpenAdd = () => {
    setEditingId(null);
    setClientName('');
    setClientRole('');
    setQuote('');
    setRating(5);
    setDate(new Date().toLocaleDateString('es-AR'));
    setPlatform('google');
    setIsActive(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setClientName(item.client_name);
    setClientRole(item.client_role);
    setQuote(item.quote.replace(/^[“"]|[”"]$/g, ''));
    setRating(item.rating || 5);
    setDate(item.date);
    setPlatform(item.platform || 'google');
    setIsActive(item.is_active);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setMessage({ text: 'Por favor completá el nombre del cliente.', type: 'error' });
      return;
    }
    if (!quote.trim()) {
      setMessage({ text: 'Por favor ingresá el texto del testimonio.', type: 'error' });
      return;
    }

    const formattedQuote = quote.trim().startsWith('“') ? quote.trim() : `“${quote.trim()}”`;

    testimonialService.saveTestimonial({
      id: editingId || undefined,
      client_name: clientName.trim(),
      client_role: clientRole.trim() || 'Cliente',
      quote: formattedQuote,
      rating,
      date: date.trim() || new Date().toLocaleDateString('es-AR'),
      platform,
      is_active: isActive,
    });

    setMessage({
      text: editingId ? 'Testimonio actualizado correctamente.' : 'Nuevo testimonio agregado exitosamente.',
      type: 'success',
    });

    setShowForm(false);
    setEditingId(null);
    loadData();
    setTimeout(() => setMessage(null), 3500);
  };

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    testimonialService.toggleActive(id);
    loadData();
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que querés eliminar el testimonio de "${name}"?`)) {
      testimonialService.deleteTestimonial(id);
      loadData();
      setMessage({ text: 'Testimonio eliminado.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Restablecer los testimonios a los valores iniciales de diseño?')) {
      testimonialService.resetToDefaults();
      loadData();
      setMessage({ text: 'Testimonios restablecidos a los valores predeterminados.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const renderPlatformBadge = (p: ReviewPlatform = 'google') => {
    switch (p) {
      case 'google':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
            <GoogleIcon className="w-3 h-3" />
            <span>Google</span>
          </span>
        );
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[10px] font-semibold border border-pink-100">
            <InstagramIcon className="w-3 h-3 text-pink-600" />
            <span>Instagram</span>
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-[#1877F2] text-[10px] font-semibold border border-blue-100">
            <FacebookIcon className="w-3 h-3" />
            <span>Facebook</span>
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
            <WhatsAppIcon className="w-3 h-3 text-emerald-600" />
            <span>WhatsApp</span>
          </span>
        );
      case 'zonaprop':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-semibold border border-orange-100">
            <ZonaPropIcon className="w-3 h-3 text-[#E0592A]" />
            <span>ZonaProp</span>
          </span>
        );
      case 'web':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-semibold border border-zinc-200">
            <WebIcon className="w-3 h-3 text-zinc-600" />
            <span>Web Adelina</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-adelina-accent bg-adelina-accent/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Quote className="w-3.5 h-3.5" />
            <span>Social Proof & Confianza</span>
          </div>
          <h1 className="font-archivo text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Reseñas & Testimonios
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-light mt-1">
            Administrá las opiniones de tus clientes, elegí su plataforma de origen (Google, Instagram, WhatsApp, etc.) y seleccioná cuáles querés que aparezcan en la portada.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-xs font-medium flex items-center gap-2"
            title="Restablecer testimonios iniciales"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Restablecer</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-adelina-dark hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-adelina-accent" />
            <span>Nueva Reseña</span>
          </button>
        </div>
      </div>

      {/* Notifications Alert */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 transition-all animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Cargadas</span>
          <div className="font-archivo text-2xl font-bold text-zinc-900">{testimonials.length}</div>
          <span className="text-[11px] text-zinc-500 font-light block">Opiniones en tu base de datos</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Activas en Home</span>
          <div className="font-archivo text-2xl font-bold text-emerald-600 flex items-center gap-2">
            <span>{activeCount}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">Visibles</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-light block">Se muestran en la portada</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Puntuación Promedio</span>
          <div className="font-archivo text-2xl font-bold text-amber-500 flex items-center gap-2">
            <span>{avgRating}</span>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <span className="text-[11px] text-zinc-500 font-light block">Calificación de satisfacción</span>
        </div>
      </div>

      {/* Add / Edit Form Panel */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-adelina-accent/20 text-adelina-dark flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-archivo text-base sm:text-lg font-bold text-zinc-900">
                {editingId ? 'Editar Testimonio' : 'Cargar Nueva Reseña'}
              </h2>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Platform Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-800 flex items-center gap-2">
                <span>Plataforma de Origen (Logo en la imagen)</span>
                <span className="text-[11px] font-normal text-zinc-400">
                  - Determina el isotipo/logo que aparecerá en el círculo superior
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {PLATFORM_OPTIONS.map((opt) => {
                  const isSelected = platform === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setPlatform(opt.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm scale-[1.02]'
                          : 'border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/80 text-zinc-700'
                      }`}
                    >
                      <div className="p-1.5 rounded-full bg-white shadow-sm flex items-center justify-center">
                        {opt.id === 'google' && <GoogleIcon className="w-5 h-5" />}
                        {opt.id === 'instagram' && (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white">
                            <InstagramIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {opt.id === 'facebook' && (
                          <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                            <FacebookIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {opt.id === 'whatsapp' && (
                          <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {opt.id === 'zonaprop' && (
                          <div className="w-5 h-5 rounded-full bg-[#E0592A] flex items-center justify-center text-white">
                            <ZonaPropIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {opt.id === 'web' && (
                          <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[#CCA352]">
                            <WebIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <span className={`text-[11px] font-semibold ${isSelected ? 'text-white' : 'text-zinc-800'}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Client Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Nombre del Cliente / Autor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Marcelo Benítez"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                  required
                />
              </div>

              {/* Client Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Operación / Rol o Subtítulo
                </label>
                <input
                  type="text"
                  value={clientRole}
                  onChange={(e) => setClientRole(e.target.value)}
                  placeholder="Ej: Comprador Depto. 3 Ambientes / Inversor"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Calificación (Estrellas)
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#F59E0B] hover:scale-125 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-current text-[#F59E0B]' : 'text-zinc-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-zinc-700 ml-2">{rating} de 5</span>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Fecha de la Reseña
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="DD/MM/AAAA o Mes Año"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Quote Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Texto del Testimonio / Comentario <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={3}
                placeholder="Escribí o pegá la opinión del cliente..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all leading-relaxed"
                required
              />
            </div>

            {/* Live Card Preview */}
            <div className="bg-zinc-100/80 p-5 rounded-2xl border border-zinc-200 space-y-3">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Vista previa de la tarjeta en la web:
              </span>
              <div className="max-w-xs mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 pt-8 shadow-sm border border-zinc-200/80 text-center relative flex flex-col justify-between space-y-3">
                  <ReviewAvatar
                    platform={platform}
                    clientName={clientName || 'Cliente'}
                    size="md"
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                  />
                  <div className="space-y-1.5">
                    <div>
                      <h4 className="font-archivo text-[11px] font-bold text-zinc-900 uppercase tracking-wider line-clamp-1">
                        {clientName || 'Nombre del Cliente'}
                      </h4>
                      <span className="text-[9.5px] text-zinc-400 font-light block line-clamp-1">
                        {clientRole || 'Rol / Operación'}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-0.5 text-[#F59E0B] py-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rating ? 'fill-current text-[#F59E0B]' : 'text-zinc-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="font-archivo text-[10.5px] text-zinc-600 font-light leading-relaxed px-1">
                      {quote.trim() ? `“${quote.trim().replace(/^[“"]|[”"]$/g, '')}”` : '“Excelente experiencia y atención personalizada...”'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 text-[9px] text-zinc-400 font-mono">
                    {date.trim() || 'Hoy'}
                  </div>
                </div>
              </div>
            </div>

            {/* Is Active Switch in Form */}
            <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div>
                <span className="text-xs font-bold text-zinc-800 block">Mostrar en la Página Web</span>
                <span className="text-[11px] text-zinc-500 font-light">
                  Si está activo, este testimonio será incluido en la sección pública de la portada.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-emerald-500' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs sm:text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-adelina-dark hover:bg-black text-white text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-95 flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-adelina-accent" />
                <span>{editingId ? 'Guardar Cambios' : 'Crear Testimonio'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-archivo text-base sm:text-lg font-bold text-zinc-900">
            Listado de Testimonios ({testimonials.length})
          </h2>
          <span className="text-xs text-zinc-400 font-light">
            Usá el interruptor para activar o pausar en la web
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 shadow-sm relative ${
                item.is_active ? 'border-zinc-200 hover:border-zinc-300' : 'border-zinc-200/60 opacity-60 bg-zinc-50/50'
              }`}
            >
              {/* Card Header: Avatar, Name, Role, & Visibility Toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ReviewAvatar
                    platform={item.platform}
                    avatarUrl={item.avatar_url}
                    clientName={item.client_name}
                    size="sm"
                    className="shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-archivo text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-wide">
                        {item.client_name}
                      </h3>
                      {renderPlatformBadge(item.platform)}
                    </div>
                    <span className="text-[11px] text-zinc-400 font-light block">
                      {item.client_role}
                    </span>
                  </div>
                </div>

                {/* Direct Visibility Toggle Switch */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleToggle(item.id, e)}
                    title={item.is_active ? 'Desactivar en web' : 'Activar en web'}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all ${
                      item.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}
                  >
                    {item.is_active ? (
                      <>
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-zinc-400" />
                        <span>Oculto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stars & Quote */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? 'fill-current' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-zinc-400 font-mono ml-1.5">
                    {item.date}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 font-light leading-relaxed italic bg-zinc-50/70 p-3 rounded-xl border border-zinc-100">
                  {item.quote}
                </p>
              </div>

              {/* Actions: Edit & Delete */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={(e) => handleDelete(item.id, item.client_name, e)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

