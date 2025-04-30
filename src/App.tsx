import { useState } from 'react';
import './App.css';
import Map from './components/Map';
import WeatherDisplay from './components/WeatherDisplay';
import FootballFieldsList from './components/SportifFields';
import SearchBar from './components/SearchBar';
import { 
  getWeatherByLocation, 
  getFootballFields, 
  geocodeCity,
  getCurrentLocation,
  getCityFromCoordinates
} from './services/api';
import { WeatherData, SportifField } from './types';

/**
 * Tipo para los marcadores del mapa
 */
type MarkerType = {
  position: [number, number];
  popup: string;
  type?: 'football' | 'weather';
};

function App() {
  // Claves API desde variables de entorno
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const FOOTBALL_FIELDS_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;

  // Estado para el mapa
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.3874, 2.1686]);
  const [mapZoom, setMapZoom] = useState(13);
  
  // Estado para la búsqueda
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Estado para los marcadores
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  
  // Estado para los datos meteorológicos
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  
  // Estado para los campos de fútbol
  const [fields, setFields] = useState<SportifField[]>([]);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsError, setFieldsError] = useState<string | null>(null);
  
  /**
   * Maneja la búsqueda por nombre de ciudad
   */
  const handleCitySearch = async (cityName: string) => {
    try {
      setSearchError(null);
      setWeatherLoading(true);
      setFieldsLoading(true);
      
      const geocodingResult = await geocodeCity(cityName);
      
      setMapCenter([geocodingResult.lat, geocodingResult.lon]);
      setMapZoom(12);
      
      await fetchWeatherData(geocodingResult.lat, geocodingResult.lon);
      await fetchFootballFields(geocodingResult.lat, geocodingResult.lon);
    } catch (error) {
      setSearchError(`No se pudo encontrar la ciudad "${cityName}". Prueba con otra.`);
      setWeatherLoading(false);
      setFieldsLoading(false);
    }
  };
  
  /**
   * Maneja la solicitud de ubicación actual
   */
  const handleLocationRequest = async () => {
    try {
      setIsLocating(true);
      setSearchError(null);
      setWeatherLoading(true);
      setFieldsLoading(true);
      
      const position = await getCurrentLocation();
      const { lat, lon } = position;
      
      await getCityFromCoordinates(lat, lon);
      
      setMapCenter([lat, lon]);
      setMapZoom(13);
      
      await fetchWeatherData(lat, lon);
      await fetchFootballFields(lat, lon);
      
      setIsLocating(false);
    } catch (error) {
      setSearchError(`No se pudo obtener tu ubicación actual: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setWeatherLoading(false);
      setFieldsLoading(false);
      setIsLocating(false);
    }
  };
  
  /**
   * Maneja el clic en el mapa
   */
  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    const { lat, lng } = latlng;
    setMapCenter([lat, lng]);
    
    fetchWeatherData(lat, lng);
    fetchFootballFields(lat, lng);
  };
  
  /**
   * Obtiene datos meteorológicos
   */
  const fetchWeatherData = async (lat: number, lng: number) => {
    setWeatherLoading(true);
    setWeatherError(null);
    
    try {
      if (!WEATHER_API_KEY) {
        setWeatherError('No se ha configurado una clave de API para el servicio meteorológico.');
        setWeatherData(null);
        return;
      }

      const data = await getWeatherByLocation(lat, lng);
      setWeatherData(data);
      
      updateMarkers(lat, lng, data.location.name, 'weather');
    } catch (error) {
      setWeatherError('Error al obtener datos meteorológicos. Por favor, inténtelo de nuevo más tarde.');
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  };
  
  /**
   * Obtiene campos de fútbol
   */
  const fetchFootballFields = async (lat: number, lng: number) => {
    setFieldsLoading(true);
    setFieldsError(null);
    
    try {
      if (!FOOTBALL_FIELDS_API_KEY) {
        setFieldsError('No se ha configurado una clave de API para el servicio de campos de fútbol.');
        setFields([]);
        return;
      }
      
      const data = await getFootballFields(lat, lng);
      
      if (data.length === 0) {
        setFieldsError('No se encontraron campos de fútbol cercanos a esta ubicación');
      }
      
      setFields(data);
      
      const newMarkers: MarkerType[] = data.map(field => ({
        position: [field.FieldInfo.Latitude, field.FieldInfo.Longitude] as [number, number],
        popup: `${field.FieldInfo.Name} - ${field.SurfaceType}${field.IsIndoor ? ' (Cubierto)' : ''}${field.HasLighting ? ' (Iluminación)' : ''}`,
        type: 'football'
      }));
      
      setMarkers(prev => {
        const weatherMarker = prev.find(m => m.type === 'weather');
        return weatherMarker ? [...newMarkers, weatherMarker] : newMarkers;
      });
    } catch (error) {
      setFieldsError('Error al obtener campos de fútbol. Por favor, inténtelo de nuevo más tarde.');
      setFields([]);
    } finally {
      setFieldsLoading(false);
    }
  };
  
  /**
   * Actualiza los marcadores en el mapa
   */
  const updateMarkers = (lat: number, lng: number, name: string, type: 'weather' | 'football') => {
    setMarkers(prev => {
      const filteredMarkers = prev.filter(m => m.type !== type);
      
      const newMarker: MarkerType = {
        position: [lat, lng],
        popup: `${name} - ${type === 'weather' ? 'Información meteorológica' : 'Campo de fútbol'}`,
        type
      };
      
      return [...filteredMarkers, newMarker];
    });
  };
  
  /**
   * Maneja la selección de un campo
   */
  const handleFieldSelect = (field: SportifField) => {
    const lat = field.FieldInfo.Latitude;
    const lng = field.FieldInfo.Longitude;
    setMapCenter([lat, lng]);
    setMapZoom(15);
  };

  return (
    <div className="app-container">
      <div className="map-container">
        <Map 
          center={mapCenter} 
          zoom={mapZoom} 
          markers={markers}
          onMapClick={handleMapClick}
        />
      </div>
      
      <div className="map-controls">
        <SearchBar 
          onSearch={handleCitySearch} 
          onLocationRequest={handleLocationRequest}
        />
        
        {isLocating && (
          <div className="locating-message">
            <div className="loading-spinner-small"></div>
            <span>Obteniendo tu ubicación...</span>
          </div>
        )}
        
        {searchError && (
          <div className="search-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {searchError}
          </div>
        )}
      </div>
      
      <div className="info-panel weather-panel">
        <WeatherDisplay 
          weatherData={weatherData}
          isLoading={weatherLoading}
          error={weatherError}
        />
      </div>
      
      <div className="info-panel fields-panel">
        <FootballFieldsList 
          fields={fields}
          isLoading={fieldsLoading}
          error={fieldsError}
          onFieldSelect={handleFieldSelect}
        />
      </div>
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-credits">
            <small>Powered by WeatherAPI & Foursquare API. Map data from OpenStreetMap.</small>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
