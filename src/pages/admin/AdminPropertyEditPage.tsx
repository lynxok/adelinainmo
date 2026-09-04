import React, { useState, useEffect } from 'react';
import { Property, OperationType, PropertyType, PropertyStatus, PropertyCategory } from '../../types/property';
import {
  Save,
  ArrowLeft,
  UploadCloud,
  X,
  Star,
  CheckCircle2,
  Plus,
  Image as ImageIcon,
  Building2,
  MapPin,
  Sparkles,
  Tags,
} from 'lucide-react';
import { propertyService, categoryService } from '../../lib/supabase';
import { compressImageToWebP } from '../../lib/imageCompressor';

interface AdminPropertyEditPageProps {
  propertyId?: string;
  onBack: () => void;
  onSaved: () => void;
}

const COMMON_AMENITIES = [
  'Piscina',
  'Quincho / Asador',
  'Seguridad 24hs',
  'Cochera cubierta',
  'Cochera doble',
  'Balcón aterrazado',
  'Calefacción central',
  'Jardín parquizado',
  'Vestidor en suite',
  'Ascensor',
  'SUM / Salón de eventos',
  'Placares e interiores completos',
  'Gas natural',
  'Aberturas DVH',
  'Alarma instalada',
  'Aire acondicionado',
];

export const AdminPropertyEditPage: React.FC<AdminPropertyEditPageProps> = ({
  propertyId,
  onBack,
  onSaved,
}) => {
  const isEditing = Boolean(propertyId);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [operationType, setOperationType] = useState<OperationType>('sale');
  const [categories, setCategories] = useState<PropertyCategory[]>(() => categoryService.getCategories());
  const [propertyType, setPropertyType] = useState<PropertyType>(() => categories[0]?.slug || 'casas');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');

  useEffect(() => {
    const update = () => setCategories(categoryService.getCategories());
    window.addEventListener('adelina-categories-changed', update);
    return () => window.removeEventListener('adelina-categories-changed', update);
  }, []);

  const handleQuickAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;
    const created = categoryService.saveCategory({ name: quickCatName.trim() });
    setPropertyType(created.slug);
    setQuickCatName('');
    setQuickAddOpen(false);
  };

  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [priceUsd, setPriceUsd] = useState<string>('');
  const [priceArs, setPriceArs] = useState<string>('');
  const [locationCity, setLocationCity] = useState('Paraná');
  const [locationNeighborhood, setLocationNeighborhood] = useState('');
  const [addressApprox, setAddressApprox] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [garages, setGarages] = useState<number>(1);
  const [coveredArea, setCoveredArea] = useState<string>('');
  const [totalArea, setTotalArea] = useState<string>('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [status, setStatus] = useState<PropertyStatus>('available');

  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing property data if editing
  useEffect(() => {
    if (propertyId) {
      const properties = propertyService.getProperties();
      const existing = properties.find((p) => p.id === propertyId);
      if (existing) {
        setTitle(existing.title);
        setSlug(existing.slug);
        setDescription(existing.description || '');
        setOperationType(existing.operation_type);
        setPropertyType(existing.property_type);
        setCurrency(existing.currency);
        setPriceUsd(existing.price_usd ? String(existing.price_usd) : '');
        setPriceArs(existing.price_ars ? String(existing.price_ars) : '');
        setLocationCity(existing.location_city);
        setLocationNeighborhood(existing.location_neighborhood);
        setAddressApprox(existing.address_approx || '');
        setGoogleMapsUrl(existing.google_maps_url || '');
        setBedrooms(existing.bedrooms);
        setBathrooms(existing.bathrooms);
        setGarages(existing.garages);
        setCoveredArea(existing.covered_area_sqm ? String(existing.covered_area_sqm) : '');
        setTotalArea(existing.total_area_sqm ? String(existing.total_area_sqm) : '');
        setAmenities(existing.amenities || []);
        setImages(existing.images || []);
        setFeaturedImage(existing.featured_image || existing.images[0] || '');
        setIsFeatured(existing.is_featured);
        setStatus(existing.status);
      }
    }
  }, [propertyId]);

  // Auto-generate slug when typing title (if not already set)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  // Image Upload handler with client-side WebP compression
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    try {
      const fileList = Array.from(e.target.files);
      const newImageUrls: string[] = [];

      for (const file of fileList) {
        // Compress client-side to WebP
        const { dataUrl } = await compressImageToWebP(file);
        newImageUrls.push(dataUrl);
      }

      const updated = [...images, ...newImageUrls];
      setImages(updated);
      if (!featuredImage && updated.length > 0) {
        setFeaturedImage(updated[0]);
      }
    } catch (err) {
      console.error('Error compressing/uploading image:', err);
      alert('Hubo un error al procesar las imágenes.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (featuredImage === images[index]) {
      setFeaturedImage(updated[0] || '');
    }
  };

  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPropertyData = {
      id: propertyId,
      title,
      slug: slug || 'inmueble-' + Date.now(),
      description,
      operation_type: operationType,
      property_type: propertyType,
      currency,
      price_usd: currency === 'USD' ? Number(priceUsd) || 0 : undefined,
      price_ars: currency === 'ARS' ? Number(priceArs) || 0 : undefined,
      location_city: locationCity,
      location_neighborhood: locationNeighborhood,
      address_approx: addressApprox,
      google_maps_url: googleMapsUrl.trim() || undefined,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      garages: Number(garages) || 0,
      covered_area_sqm: Number(coveredArea) || 0,
      total_area_sqm: Number(totalArea) || 0,
      amenities,
      images: images.length > 0 ? images : ['/assets/chic-living.jpg'],
      featured_image: featuredImage || images[0] || '/assets/chic-living.jpg',
      is_featured: isFeatured,
      status,
    };

    propertyService.saveProperty(newPropertyData);
    setSavedSuccess(true);

    setTimeout(() => {
      onSaved();
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 hover:text-adelina-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inventario</span>
        </button>

        <h1 className="font-archivo text-xl font-bold text-zinc-900">
          {isEditing ? 'Editar Inmueble' : 'Cargar Nueva Propiedad'}
        </h1>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">¡Propiedad guardada con éxito! Redirigiendo...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. SECCIÓN MULTIMEDIA & FOTOS (Con compresión WebP en cliente) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-archivo text-base font-bold text-zinc-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-adelina-accent" />
                <span>Fotografías del Inmueble</span>
              </h2>
              <p className="text-xs text-zinc-500 font-light">
                Las fotos se optimizan y comprimen a WebP automáticamente para cargar ultra rápido.
              </p>
            </div>
            <span className="text-xs font-semibold text-zinc-400">
              {images.length} fotos cargadas
            </span>
          </div>

          {/* Upload Drop Area */}
          <label className="border-2 border-dashed border-zinc-300 hover:border-adelina-accent rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-zinc-50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <UploadCloud className="w-10 h-10 text-adelina-accent mb-2" />
            <span className="font-archivo font-bold text-xs sm:text-sm text-zinc-800">
              {uploading ? 'Procesando y comprimiendo a WebP...' : 'Hacé clic o arrastrá fotos aquí'}
            </span>
            <span className="text-[11px] text-zinc-400 font-light mt-1">
              Formatos JPG, PNG, WEBP. Se optimizan automáticamente.
            </span>
          </label>

          {/* Photos Grid & Cover Selector */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-3">
              {images.map((img, idx) => {
                const isCover = featuredImage === img || (idx === 0 && !featuredImage);
                return (
                  <div
                    key={idx}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden group border-2 ${
                      isCover ? 'border-adelina-accent ring-2 ring-adelina-accent/30' : 'border-zinc-200'
                    }`}
                  >
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />

                    {/* Cover badge */}
                    {isCover && (
                      <span className="absolute top-1.5 left-1.5 bg-adelina-accent text-adelina-dark text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase shadow">
                        Portada
                      </span>
                    )}

                    {/* Actions on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFeaturedImage(img)}
                        title="Marcar como Portada"
                        className="p-1.5 bg-white text-zinc-900 rounded-lg text-xs hover:bg-adelina-accent transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Eliminar Foto"
                        className="p-1.5 bg-rose-600 text-white rounded-lg text-xs hover:bg-rose-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. DATOS PRINCIPALES & PRECIO */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="font-archivo text-base font-bold text-zinc-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-adelina-accent" />
            <span>Datos Principales & Valores</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-medium text-zinc-700 mb-1">Título de la Publicación *</label>
              <input
                type="text"
                required
                placeholder="Ej. Casa en Barrio Privado con Piscina y Gran Parque"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-zinc-700 mb-1">Código / Slug Web *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-600 font-mono focus:outline-none focus:border-adelina-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Tipo de Operación *</label>
              <select
                value={operationType}
                onChange={(e) => setOperationType(e.target.value as OperationType)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent cursor-pointer"
              >
                <option value="sale">Venta</option>
                <option value="rent">Alquiler</option>
                <option value="temporary_rent">Alquiler Temporario</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-zinc-700">Tipo de Inmueble *</label>
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(!quickAddOpen)}
                  className="text-[11px] text-adelina-accent hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Nueva Categoría</span>
                </button>
              </div>

              {quickAddOpen && (
                <div className="mb-2 p-2.5 bg-adelina-accent/10 border border-adelina-accent/30 rounded-xl flex items-center gap-2 animate-fadeIn">
                  <input
                    type="text"
                    placeholder="Nombre ej. Cocheras, Galpones..."
                    value={quickCatName}
                    onChange={(e) => setQuickCatName(e.target.value)}
                    className="flex-1 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-adelina-accent"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleQuickAddCategory}
                    className="bg-adelina-accent text-adelina-dark font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:bg-adelina-gold whitespace-nowrap"
                  >
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(false)}
                    className="text-zinc-400 hover:text-zinc-700 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Moneda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent cursor-pointer"
              >
                <option value="USD">Dólares (USD)</option>
                <option value="ARS">Pesos Argentinos (ARS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                {currency === 'USD' ? 'Precio USD *' : 'Precio ARS *'}
              </label>
              <input
                type="number"
                required
                placeholder={currency === 'USD' ? '185000' : '450000'}
                value={currency === 'USD' ? priceUsd : priceArs}
                onChange={(e) => currency === 'USD' ? setPriceUsd(e.target.value) : setPriceArs(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 font-archivo font-bold focus:outline-none focus:border-adelina-accent"
              />
            </div>
          </div>
        </div>

        {/* 3. UBICACIÓN & SUPERFICIES */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="font-archivo text-base font-bold text-zinc-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-adelina-accent" />
            <span>Ubicación y Dimensiones</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Ciudad *</label>
              <input
                type="text"
                required
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Barrio / Zona *</label>
              <input
                type="text"
                required
                placeholder="Ej. Centro, Parque Urquiza..."
                value={locationNeighborhood}
                onChange={(e) => setLocationNeighborhood(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Dirección Aproximada (Pública)</label>
              <input
                type="text"
                placeholder="Ej. Zona Casa de Gobierno"
                value={addressApprox}
                onChange={(e) => setAddressApprox(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Link de Google Maps (Ubicación exacta / Pin)
            </label>
            <input
              type="url"
              placeholder="Ej. https://maps.app.goo.gl/... o https://goo.gl/maps/..."
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
            />
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Este enlace se utilizará directamente cuando el usuario pulse el botón &quot;Ver en Google Maps&quot; en la Ficha Técnica del inmueble.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Dormitorios</label>
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Baños</label>
              <input
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Cocheras</label>
              <input
                type="number"
                min="0"
                value={garages}
                onChange={(e) => setGarages(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Sup. Cubierta (m²)</label>
              <input
                type="number"
                placeholder="220"
                value={coveredArea}
                onChange={(e) => setCoveredArea(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Sup. Total / Terreno (m²)</label>
              <input
                type="number"
                placeholder="650"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>
          </div>
        </div>

        {/* 4. DESCRIPCIÓN & AMENITIES */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Descripción Completa del Inmueble</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detallá la distribución, iluminación, calidades constructivas, orientación y equipamiento..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent resize-none font-light leading-relaxed"
            />
          </div>

          {/* Amenities Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-zinc-700">Amenities & Equipamiento</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((item) => {
                const active = amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active
                        ? 'bg-adelina-dark text-white shadow-sm'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {active ? `✓ ${item}` : `+ ${item}`}
                  </button>
                );
              })}
            </div>

            {/* Custom Amenity input */}
            <div className="flex items-center gap-2 pt-2 max-w-sm">
              <input
                type="text"
                placeholder="Agregar otro amenity..."
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomAmenity}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-3 py-1.5 rounded-xl text-xs font-medium"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>

        {/* 5. ESTADO & VISIBILIDAD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 accent-adelina-accent rounded cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs sm:text-sm font-medium text-zinc-800 cursor-pointer">
              <strong className="block">Destacar en Portada (Home)</strong>
              <span className="text-zinc-400 font-light text-xs">Aparecerá en el carrusel principal de la web pública.</span>
            </label>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-medium text-zinc-700">Estado del Inmueble:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PropertyStatus)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="available">Disponible</option>
              <option value="reserved">Reservada</option>
              <option value="sold">Vendida</option>
              <option value="rented">Alquilada</option>
              <option value="hidden">Oculta (Borrador)</option>
            </select>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-6 py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-adelina-dark hover:bg-black text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Save className="w-4 h-4 text-adelina-accent" />
            <span>{isEditing ? 'Guardar Cambios' : 'Publicar Inmueble'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
