import React, { useState, useEffect } from 'react';
import { PropertyCategory, Property } from '../../types/property';
import { categoryService, propertyService, matchesPropertyCategory } from '../../lib/supabase';
import { Tags, Plus, Trash2, Edit2, Check, X, RotateCcw, Building2, Sparkles } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<PropertyCategory[]>(() => categoryService.getCategories());
  const [properties, setProperties] = useState<Property[]>(() => propertyService.getProperties());
  
  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = () => {
    setCategories(categoryService.getCategories());
    setProperties(propertyService.getProperties());
  };

  useEffect(() => {
    window.addEventListener('adelina-categories-changed', loadData);
    return () => window.removeEventListener('adelina-categories-changed', loadData);
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ text: 'Por favor ingresá un nombre para la categoría', type: 'error' });
      return;
    }

    categoryService.saveCategory({
      id: editingId || undefined,
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
    });

    setMessage({
      text: editingId ? 'Categoría actualizada exitosamente.' : 'Nueva categoría creada y sincronizada.',
      type: 'success',
    });

    // Reset
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setShowAddForm(false);
    loadData();

    setTimeout(() => setMessage(null), 3500);
  };

  const handleEdit = (cat: PropertyCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (cat: PropertyCategory) => {
    const count = properties.filter(p => matchesPropertyCategory(p.property_type, cat.slug)).length;
    const confirmText = count > 0
      ? `Hay ${count} propiedades asignadas a "${cat.name}". ¿Deseas eliminar esta categoría de todas formas?`
      : `¿Confirmas eliminar la categoría "${cat.name}"?`;

    if (window.confirm(confirmText)) {
      categoryService.deleteCategory(cat.id);
      loadData();
      setMessage({ text: `Categoría "${cat.name}" eliminada.`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restaurar las 5 categorías iniciales (Casas, Departamentos, Lotes, Cocheras, Quintas)?')) {
      categoryService.resetToDefaults();
      loadData();
      setMessage({ text: 'Categorías restauradas a los valores por defecto.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tags className="w-6 h-6 text-adelina-accent" />
            <h1 className="font-archivo text-2xl sm:text-3xl font-bold text-zinc-900">
              Gestión de Categorías
            </h1>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Administrá las categorías de inmuebles. Las categorías activas se reflejan de inmediato en el desplegable de navegación y en el catálogo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-300 transition-colors shadow-sm"
            title="Restaurar las 5 categorías originales"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Restaurar Base</span>
          </button>

          {!showAddForm && (
            <button
              onClick={() => {
                setEditingId(null);
                setName('');
                setSlug('');
                setDescription('');
                setShowAddForm(true);
              }}
              className="inline-flex items-center gap-2 bg-adelina-accent hover:bg-adelina-gold text-adelina-dark font-archivo font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Categoría</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Message */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-fadeIn ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Add / Edit Category Form */}
      {showAddForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-adelina-accent/40 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h2 className="font-archivo text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Tags className="w-4 h-4 text-adelina-accent" />
              <span>{editingId ? 'Editar Categoría' : 'Crear Nueva Categoría'}</span>
            </h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Casas, Departamentos, Lotes, Cocheras..."
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Identificador / Slug URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. casas, departamentos, lotes..."
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-700 font-mono focus:outline-none focus:border-adelina-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Descripción (opcional)
              </label>
              <input
                type="text"
                placeholder="Breve descripción o detalle para identificar el tipo de inmueble..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-adelina-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-adelina-accent hover:bg-adelina-gold text-adelina-dark font-archivo font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Actualizar Categoría' : 'Guardar Categoría'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <span className="font-archivo text-xs font-bold text-zinc-800 uppercase tracking-wider">
            Categorías Activas ({categories.length})
          </span>
          <span className="text-[11px] text-zinc-400 font-light">
            Se muestran en el orden del desplegable
          </span>
        </div>

        <div className="divide-y divide-zinc-100">
          {categories.map((cat, index) => {
            const count = properties.filter(p => matchesPropertyCategory(p.property_type, cat.slug)).length;

            return (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/70 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-adelina-accent/15 flex items-center justify-center text-adelina-dark shrink-0 font-archivo font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-archivo font-bold text-sm sm:text-base text-zinc-900">
                        {cat.name}
                      </h3>
                      <span className="font-mono text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md">
                        {cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-zinc-500 text-xs mt-0.5 font-light">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pl-11 sm:pl-0">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-100/80 px-2.5 py-1 rounded-full">
                    <Building2 className="w-3.5 h-3.5 text-adelina-accent" />
                    <span>
                      <strong className="text-zinc-800 font-semibold">{count}</strong> propiedades
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(cat)}
                      title="Editar categoría"
                      className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      title="Eliminar categoría"
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
