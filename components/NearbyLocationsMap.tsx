'use client';

import { useState, useEffect, useCallback } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';

interface NearbyLocation {
  name: string;
  distance: number; // en kilómetros
  category: 'university' | 'supermarket' | 'pharmacy' | 'restaurant';
  lat?: number;
  lng?: number;
  address?: string;
}

interface NearbyLocationsMapProps {
  propertyAddress: string;
  propertyLat?: number;
  propertyLng?: number;
  propertyId?: string; // ID de la propiedad actual para no duplicarla
}

export default function NearbyLocationsMap({ 
  propertyAddress, 
  propertyLat, 
  propertyLng,
  propertyId 
}: NearbyLocationsMapProps) {
  const [activeCategory, setActiveCategory] = useState<'university' | 'supermarket' | 'pharmacy' | 'restaurant'>('university');
  const [selectedLocation, setSelectedLocation] = useState<NearbyLocation | null>(null);
  const [viewState, setViewState] = useState({
    longitude: propertyLng || -98.2061,
    latitude: propertyLat || 19.0414,
    zoom: 14
  });

  // Coordenadas exactas de universidades en Puebla, México
  // Obtén coordenadas precisas desde Google Maps: clic derecho > "¿Qué hay aquí?"
  const nearbyLocations: Record<string, NearbyLocation[]> = {
    university: [
      // BUAP - Ciudad Universitaria (Principal) - Coordenadas exactas
      { name: 'BUAP - Benemérita Universidad Autónoma de Puebla', distance: 0.5, category: 'university', lat: 18.999849, lng: -98.20353964199789 },
      // UDLAP - Universidad de las Américas Puebla (Cholula) - Coordenadas exactas
      { name: 'UDLAP - Universidad de las Américas Puebla', distance: 1.2, category: 'university', lat: 19.054894482145322, lng: -98.303056 },
      // UPAEP - Universidad Popular Autónoma del Estado de Puebla - Coordenadas exactas
      { name: 'Universidad Popular Autónoma del Estado de Puebla', distance: 0.8, category: 'university', lat: 19.040556, lng: -98.206111 },
      // ITP - Instituto Tecnológico de Puebla - Coordenadas exactas
      { name: 'Instituto Tecnológico de Puebla', distance: 1.5, category: 'university', lat: 19.058474, lng: -98.151620 },
      // Ibero Puebla - Universidad Iberoamericana Puebla - Coordenadas exactas
      { name: 'Universidad Iberoamericana Puebla', distance: 1.0, category: 'university', lat: 19.043720, lng: -98.198149 },
    ],
    supermarket: [
      { name: 'Walmart', distance: 0.3, category: 'supermarket', lat: 19.0433, lng: -98.2019 },
      { name: 'Soriana', distance: 0.5, category: 'supermarket', lat: 19.0444, lng: -98.2022 },
      { name: 'Chedraui', distance: 0.7, category: 'supermarket', lat: 19.0455, lng: -98.2033 },
      { name: 'La Comer', distance: 0.4, category: 'supermarket', lat: 19.0422, lng: -98.2011 },
      { name: 'Bodega Aurrerá', distance: 0.6, category: 'supermarket', lat: 19.0411, lng: -98.2022 },
    ],
    pharmacy: [
      { name: 'Farmacias del Ahorro', distance: 0.2, category: 'pharmacy', lat: 19.0433, lng: -98.2011 },
      { name: 'Farmacias Similares', distance: 0.3, category: 'pharmacy', lat: 19.0444, lng: -98.2015 },
      { name: 'Farmacias Guadalajara', distance: 0.4, category: 'pharmacy', lat: 19.0455, lng: -98.2022 },
      { name: 'Farmacias San Pablo', distance: 0.5, category: 'pharmacy', lat: 19.0422, lng: -98.2018 },
      { name: 'Farmacia Benavides', distance: 0.3, category: 'pharmacy', lat: 19.0411, lng: -98.2013 },
    ],
    restaurant: [
      { name: 'Restaurante El Mural de los Poblanos', distance: 0.4, category: 'restaurant', lat: 19.0433, lng: -98.2022 },
      { name: 'La Noria', distance: 0.5, category: 'restaurant', lat: 19.0444, lng: -98.2028 },
      { name: 'Casa Reyna', distance: 0.3, category: 'restaurant', lat: 19.0455, lng: -98.2015 },
      { name: 'El Patio', distance: 0.6, category: 'restaurant', lat: 19.0422, lng: -98.2033 },
      { name: 'La Fonda de Santa Clara', distance: 0.4, category: 'restaurant', lat: 19.0411, lng: -98.2025 },
    ],
  };

  // Actualizar viewState cuando cambian las coordenadas de la propiedad
  useEffect(() => {
    if (propertyLat && propertyLng) {
      setViewState(prev => ({
        ...prev,
        longitude: propertyLng,
        latitude: propertyLat,
      }));
    }
  }, [propertyLat, propertyLng]);

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calcular distancias reales desde la propiedad
  const getLocationsWithDistances = () => {
    const locations = nearbyLocations[activeCategory] || [];
    if (!propertyLat || !propertyLng) {
      return locations; // Si no hay coordenadas de propiedad, usar distancias predefinidas
    }
    
    return locations.map(location => {
      if (location.lat && location.lng) {
        const distance = calculateDistance(propertyLat, propertyLng, location.lat, location.lng);
        return { ...location, distance };
      }
      return location;
    }).sort((a, b) => a.distance - b.distance); // Ordenar por distancia
  };

  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${(km * 1000).toFixed(0)} m`;
    }
    return `${km.toFixed(1)} km`;
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      university: 'Universidades',
      supermarket: 'Supermercados',
      pharmacy: 'Farmacias',
      restaurant: 'Restaurantes',
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      university: '🎓',
      supermarket: '🛒',
      pharmacy: '💊',
      restaurant: '🍽️',
    };
    return icons[category] || '📍';
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      university: '#3B82F6', // blue
      supermarket: '#10B981', // green
      pharmacy: '#8B5CF6', // purple
      restaurant: '#F59E0B', // orange
    };
    return colors[category] || '#6B7280';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const currentLocations = getLocationsWithDistances();
  
  // Filtrar ubicaciones por búsqueda
  const filteredLocations = currentLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Verificar si hay API key disponible
  const hasApiKey = () => {
    const key = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
    return key.trim().length > 0;
  };

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

  // Estado para otras propiedades
  const [otherProperties, setOtherProperties] = useState<Array<{
    id: string;
    name_es: string;
    name_en: string;
    slug: string;
    latitude: number;
    longitude: number;
  }>>([]);

  // Cargar otras propiedades con coordenadas
  useEffect(() => {
    const fetchOtherProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) return;
        const data = await res.json();
        // Filtrar propiedades con coordenadas y excluir la actual
        const propertiesWithCoords = (data || []).filter((prop: any) => 
          prop.latitude && 
          prop.longitude && 
          prop.id !== propertyId
        );
        setOtherProperties(propertiesWithCoords);
      } catch (error) {
        console.error('Error fetching other properties:', error);
      }
    };

    if (propertyId) {
      fetchOtherProperties();
    }
  }, [propertyId]);

  // Manejar clic en marcador
  const handleMarkerClick = useCallback((location: NearbyLocation) => {
    setSelectedLocation(location);
  }, []);

  // Manejar clic en ubicación de la lista
  const handleLocationClick = useCallback((location: NearbyLocation) => {
    setSelectedLocation(location);
    if (location.lat && location.lng) {
      setViewState(prev => ({
        ...prev,
        longitude: location.lng!,
        latitude: location.lat!,
        zoom: 15,
      }));
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ubicaciones Cercanas y Mapa</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['university', 'supermarket', 'pharmacy', 'restaurant'] as const).map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setSelectedLocation(null);
            }}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeCategory === category
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="order-2 lg:order-1">
          <div className="bg-gray-100 rounded-lg overflow-hidden h-[400px] relative">
            {!hasApiKey() ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gray-50">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-gray-700 font-semibold mb-2">API Key de Mapbox no configurada</p>
                <p className="text-sm text-gray-600 mb-1">
                  Agrega esta línea a tu archivo <code className="bg-gray-200 px-2 py-1 rounded text-xs">.env.local</code>:
                </p>
                <code className="bg-gray-200 px-3 py-2 rounded text-xs block mt-2 font-mono">
                  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_access_token_aqui
                </code>
                <p className="text-xs text-gray-500 mt-3">
                  Obtén tu token gratuito en{' '}
                  <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    mapbox.com
                  </a>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Luego reinicia el servidor de desarrollo
                </p>
              </div>
            ) : (
              <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapboxAccessToken={mapboxToken}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                attributionControl={false}
              >
                {/* Marcador de la propiedad */}
                {propertyLat && propertyLng && (
                  <Marker
                    longitude={propertyLng}
                    latitude={propertyLat}
                  >
                    <div className="relative" style={{ transform: 'translateY(-100%)' }}>
                      <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                    </div>
                  </Marker>
                )}

                {/* Marcadores de otras propiedades */}
                {otherProperties.map((prop) => (
                  <Marker
                    key={prop.id}
                    longitude={prop.longitude}
                    latitude={prop.latitude}
                  >
                    <a
                      href={`/casas/${prop.slug}`}
                      className="relative cursor-pointer block"
                      style={{ transform: 'translateY(-100%)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold hover:bg-blue-600 transition-colors">
                        🏠
                      </div>
                    </a>
                  </Marker>
                ))}

                {/* Marcadores de ubicaciones cercanas */}
                {filteredLocations
                  .filter(loc => loc.lat && loc.lng)
                  .map((location, index) => (
                    <Marker
                      key={`location-${index}`}
                      longitude={location.lng!}
                      latitude={location.lat!}
                      onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        handleMarkerClick(location);
                      }}
                    >
                      <div 
                        className="relative cursor-pointer"
                        style={{ 
                          transform: 'translateY(-100%)',
                          filter: selectedLocation === location ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none'
                        }}
                      >
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: getCategoryColor(location.category) }}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </Marker>
                  ))}

                {/* Popup para ubicación seleccionada */}
                {selectedLocation && selectedLocation.lat && selectedLocation.lng && (
                  <Popup
                    longitude={selectedLocation.lng}
                    latitude={selectedLocation.lat}
                    anchor="bottom"
                    onClose={() => setSelectedLocation(null)}
                    closeButton={true}
                    closeOnClick={false}
                    className="mapbox-popup"
                  >
                    <div className="p-2">
                      <p className="font-semibold text-sm text-gray-900 mb-1">
                        {selectedLocation.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDistance(selectedLocation.distance)} de distancia
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs mt-2 inline-block"
                      >
                        Ver en Google Maps →
                      </a>
                    </div>
                  </Popup>
                )}
              </Map>
            )}
            
            {/* Leyenda */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-xs text-gray-600 z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Propiedad actual</span>
              </div>
              {otherProperties.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Otras propiedades</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(activeCategory) }}></div>
                <span>{getCategoryLabel(activeCategory)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Locations List */}
        <div className="order-1 lg:order-2">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Buscar {getCategoryLabel(activeCategory)}</p>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Buscar ${getCategoryLabel(activeCategory).toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-3 max-h-[340px] overflow-y-auto">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location, index) => {
                const isSelected = selectedLocation === location;
                
                return (
                  <div
                    key={index}
                    onClick={() => handleLocationClick(location)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleLocationClick(location);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`flex items-center gap-3 p-3 bg-white rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-primary shadow-md' 
                        : 'border-gray-200 hover:border-primary hover:shadow-sm'
                    }`}
                  >
                    <div className="text-2xl flex-shrink-0">
                      {getCategoryIcon(location.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {location.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDistance(location.distance)} de distancia
                      </p>
                    </div>
                    {location.lat && location.lng && (
                      <div 
                        className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: getCategoryColor(location.category) }}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No se encontraron {getCategoryLabel(activeCategory).toLowerCase()} con ese nombre
              </div>
            )}
          </div>
          
          {filteredLocations.length > 0 && (
            <button className="text-primary font-medium hover:underline mt-4 flex items-center gap-1 text-sm w-full justify-center">
              Ver todas las ubicaciones ({filteredLocations.length}) <span>&gt;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
