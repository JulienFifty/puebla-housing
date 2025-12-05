'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name_es: '',
    name_en: '',
    slug: '',
    location_es: '',
    location_en: '',
    address: '',
    zone: '',
    university: '',
    description_es: '',
    description_en: '',
    images: [] as string[],
    available: true,
    google_place_id: '',
    common_areas: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEs: formData.name_es,
          nameEn: formData.name_en,
          slug: formData.slug,
          locationEs: formData.location_es,
          locationEn: formData.location_en,
          address: formData.address,
          zone: formData.zone,
          university: formData.university,
          descriptionEs: formData.description_es,
          descriptionEn: formData.description_en,
          images: formData.images,
          available: formData.available,
          googlePlaceId: formData.google_place_id || null,
          commonAreas: formData.common_areas,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create');
      }

      router.push('/dashboard/properties');
    } catch (error: any) {
      console.error('Error creating property:', error);
      setError(error.message || 'Error al crear la propiedad');
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      setFormData({
        ...formData,
        images: [...formData.images, url],
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-text-main">Nueva Propiedad</h1>
        <Link
          href="/dashboard/properties"
          className="text-text-secondary hover:text-primary"
        >
          ← Volver
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Nombre (Español) *
            </label>
            <input
              type="text"
              value={formData.name_es}
              onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Nombre (Inglés) *
            </label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              required
              placeholder="ej: casa-mariachi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">URL amigable (sin espacios, solo letras, números y guiones)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Google Place ID
            </label>
            <input
              type="text"
              value={formData.google_place_id}
              onChange={(e) => setFormData({ ...formData, google_place_id: e.target.value })}
              placeholder="ChIJ..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Opcional: Para mostrar reseñas de Google My Business</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Ubicación (Español) *
            </label>
            <input
              type="text"
              value={formData.location_es}
              onChange={(e) => setFormData({ ...formData, location_es: e.target.value })}
              required
              placeholder="ej: Tres Cruces, Puebla"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Ubicación (Inglés) *
            </label>
            <input
              type="text"
              value={formData.location_en}
              onChange={(e) => setFormData({ ...formData, location_en: e.target.value })}
              required
              placeholder="ej: Tres Cruces, Puebla"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Dirección *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              placeholder="ej: Fray Andrés de Olmos 2621, Tres Cruces, Puebla"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Zona *
            </label>
            <select
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona una zona</option>
              <option value="tres-cruces">Tres Cruces</option>
              <option value="centro">Centro</option>
              <option value="cholula">Cholula</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Universidad *
            </label>
            <select
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona una universidad</option>
              <option value="BUAP">BUAP</option>
              <option value="Centro">Centro</option>
              <option value="UDLAP">UDLAP</option>
              <option value="IBERO">IBERO</option>
              <option value="UPAEP">UPAEP</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Descripción (Español) *
          </label>
          <textarea
            value={formData.description_es}
            onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
            required
            rows={4}
            placeholder="Describe la propiedad en español..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Descripción (Inglés) *
          </label>
          <textarea
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            required
            rows={4}
            placeholder="Describe the property in English..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Imágenes
          </label>
          <div className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Vista previa de la imagen */}
                  <div className="flex-shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect width="128" height="128" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  
                  {/* Input de URL */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                      placeholder="URL de la imagen"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              + Agregar Imagen
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="mr-2"
            />
            Disponible
          </label>
        </div>

        {/* Áreas Comunes */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Áreas Comunes
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Ingresa las áreas comunes separadas por comas (ej: Terraza, Patio, Jardín, Roof garden, Asador, Salas, Cocinas, Zona de ejercicio)
          </p>
          <input
            type="text"
            value={formData.common_areas.join(', ')}
            onChange={(e) => {
              const areas = e.target.value
                .split(',')
                .map(area => area.trim())
                .filter(area => area.length > 0);
              setFormData({ ...formData, common_areas: areas });
            }}
            placeholder="Terraza, Patio, Jardín, Roof garden..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {formData.common_areas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.common_areas.map((area, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => {
                      const newAreas = formData.common_areas.filter((_, i) => i !== index);
                      setFormData({ ...formData, common_areas: newAreas });
                    }}
                    className="text-primary hover:text-primary-hover"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50"
          >
            {saving ? 'Creando...' : 'Crear Propiedad'}
          </button>
          <Link
            href="/dashboard/properties"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}



