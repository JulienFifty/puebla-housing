'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Property {
  id: string;
  name_es: string;
  name_en: string;
  slug: string;
  location_es: string;
  location_en: string;
  address: string;
  zone: string;
  university: string;
  description_es: string;
  description_en: string;
  images: string[];
  bathroom_types: string[];
  available: boolean;
  available_from: string | null;
  total_rooms: number;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
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
    available_from: '',
    google_place_id: '',
    common_areas: [] as string[],
  });

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/properties/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProperty(data);
      setFormData({
        name_es: data.name_es || '',
        name_en: data.name_en || '',
        slug: data.slug || '',
        location_es: data.location_es || '',
        location_en: data.location_en || '',
        address: data.address || '',
        zone: data.zone || '',
        university: data.university || '',
        description_es: data.description_es || '',
        description_en: data.description_en || '',
        images: data.images || [],
        available: data.available ?? true,
        available_from: data.available_from || '',
        google_place_id: data.google_place_id || '',
        common_areas: data.common_areas || [],
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Error al cargar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
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
          availableFrom: formData.available_from || null,
          googlePlaceId: formData.google_place_id || null,
          commonAreas: formData.common_areas,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update');
      }

      router.push('/dashboard/properties');
    } catch (error: any) {
      console.error('Error updating property:', error);
      setError(error.message || 'Error al actualizar la propiedad');
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

  const handleMoveImageUp = (index: number) => {
    if (index === 0) return; // Ya está en la primera posición
    const newImages = [...formData.images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setFormData({ ...formData, images: newImages });
  };

  const handleMoveImageDown = (index: number) => {
    if (index === formData.images.length - 1) return; // Ya está en la última posición
    const newImages = [...formData.images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setFormData({ ...formData, images: newImages });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Propiedad no encontrada</h2>
          <Link href="/dashboard/properties" className="text-primary hover:underline">
            Volver a propiedades
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-text-main">Editar Propiedad</h1>
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
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Imágenes
          </label>
          <p className="text-xs text-gray-500 mb-3">
            El orden de las imágenes aquí determina cómo aparecerán en la página pública. Usa las flechas para reordenar.
          </p>
          <div className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex gap-4 items-start">
                  {/* Controles de ordenamiento */}
                  <div className="flex flex-col gap-2 flex-shrink-0 pt-2">
                    <button
                      type="button"
                      onClick={() => handleMoveImageUp(index)}
                      disabled={index === 0}
                      className={`p-2 rounded-lg transition-colors ${
                        index === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-primary hover:text-white border border-gray-300'
                      }`}
                      title="Mover hacia arriba"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveImageDown(index)}
                      disabled={index === formData.images.length - 1}
                      className={`p-2 rounded-lg transition-colors ${
                        index === formData.images.length - 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-primary hover:text-white border border-gray-300'
                      }`}
                      title="Mover hacia abajo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="text-center text-xs text-gray-500 font-medium pt-1">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Vista previa de la imagen */}
                  <div className="flex-shrink-0">
                    {image ? (
                      <div className="relative">
                        <img
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect width="128" height="128" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded font-semibold">
                            Principal
                          </div>
                        )}
                      </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Habitaciones disponibles a partir de
            </label>
            <input
              type="date"
              value={formData.available_from}
              onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si se especifica, se mostrará un badge &quot;Habitaciones disponibles a partir de [fecha]&quot; en la tarjeta de la casa.
            </p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
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

