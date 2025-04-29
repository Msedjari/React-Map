import axios from 'axios';
import { WeatherData, FootballField } from '../types';

// Claves API desde variables de entorno
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const FOOTBALL_FIELDS_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;

// Interfaz para datos de geocodificación
export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  region?: string;
}

/**
 * Convierte un nombre de ciudad en coordenadas usando OpenStreetMap Nominatim
 */
export const geocodeCity = async (cityName: string): Promise<GeocodingResult> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: cityName,
          format: 'json',
          limit: 1,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'FootballFieldsApp/1.0'
        }
      }
    );
    
    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      
      return {
        name: location.name || cityName,
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon),
        country: location.address?.country || '',
        region: location.address?.state || location.address?.county || ''
      };
    }
    
    throw new Error('City not found');
  } catch (error) {
    console.error('Error geocoding city:', error);
    throw error;
  }
};

/**
 * Obtiene datos meteorológicos basados en coordenadas usando WeatherAPI.com
 */
export const getWeatherByLocation = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    if (!WEATHER_API_KEY) {
      throw new Error('No Weather API key provided');
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=no`
    );
    
    if (response.data.error) {
      throw new Error(response.data.error.message || 'Error in WeatherAPI');
    }
    
    return {
      location: {
        name: response.data.location.name,
        region: response.data.location.region,
        country: response.data.location.country,
        lat: response.data.location.lat,
        lon: response.data.location.lon,
        localtime: response.data.location.localtime
      },
      current: {
        temp_c: response.data.current.temp_c,
        condition: {
          text: response.data.current.condition.text,
          icon: response.data.current.condition.icon,
          code: response.data.current.condition.code || 1000
        },
        wind_kph: response.data.current.wind_kph,
        humidity: response.data.current.humidity,
        cloud: response.data.current.cloud,
        feelslike_c: response.data.current.feelslike_c,
        is_day: response.data.current.is_day,
        uv: response.data.current.uv
      }
    };
  } catch (error) {
    console.error('Error getting weather data:', error);
    throw error;
  }
};

/**
 * Busca campos de fútbol cercanos utilizando la API de Foursquare
 * Implementa múltiples estrategias de búsqueda en caso de fallos
 */
export const getFootballFields = async (lat: number, lon: number, radius: number = 5): Promise<FootballField[]> => {
  try {
    // Convertir radio de km a metros para Foursquare
    const radiusInMeters = radius * 1000;
    
    if (!FOOTBALL_FIELDS_API_KEY) {
      throw new Error('No Foursquare API key provided');
    }
    
    const apiKey = FOOTBALL_FIELDS_API_KEY.trim();
    
    // Estrategia 1: Búsqueda directa por categorías específicas
    try {
      const response = await axios.get(
        `https://api.foursquare.com/v3/places/search`,
        {
          params: {
            ll: `${lat},${lon}`,
            radius: radiusInMeters,
            categories: '18041,18006', // Campos de fútbol y deportivos
            limit: 50,
            sort: 'DISTANCE',
            fields: 'fsq_id,categories,geocodes,location,name,distance,tel,website'
          },
          headers: {
            'Authorization': apiKey,
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data?.results?.length > 0) {
        return mapFoursquareToFootballFields(response.data.results, lat, lon);
      }
    } catch (error) {
      // Continuar con estrategia alternativa
    }
    
    // Estrategia 2: Usar autenticación con prefijo Bearer
    try {
      const bearerResponse = await axios.get(
        `https://api.foursquare.com/v3/places/search`,
        {
          params: {
            ll: `${lat},${lon}`,
            radius: radiusInMeters,
            categories: '18041,18006',
            limit: 50,
            sort: 'DISTANCE',
            fields: 'fsq_id,categories,geocodes,location,name,distance,tel,website'
          },
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
          }
        }
      );
      
      if (bearerResponse.data?.results?.length > 0) {
        return mapFoursquareToFootballFields(bearerResponse.data.results, lat, lon);
      }
    } catch (error) {
      // Continuar con estrategia alternativa
    }
    
    // Estrategia 3: Búsqueda por términos relacionados con fútbol
    try {
      const searchTerms = [
        'football', 'soccer', 'futbol', 'campo de futbol', 'terrain de football'
      ];
      
      let allResults: any[] = [];
      
      for (const term of searchTerms) {
        try {
          const queryResponse = await axios.get(
            `https://api.foursquare.com/v3/places/search`,
            {
              params: {
                ll: `${lat},${lon}`,
                query: term,
                radius: radiusInMeters * 2,
                limit: 20
              },
              headers: {
                'Authorization': apiKey,
                'Accept': 'application/json'
              }
            }
          );
          
          if (queryResponse.data?.results) {
            allResults = [...allResults, ...queryResponse.data.results];
            if (allResults.length > 10) break;
          }
        } catch (termError) {
          // Continuar con el siguiente término
        }
      }
      
      // Eliminar duplicados
      const uniqueResults = Array.from(
        new Map(allResults.map(item => [item.fsq_id || item.id, item])).values()
      );
      
      if (uniqueResults.length > 0) {
        return mapFoursquareToFootballFields(uniqueResults, lat, lon);
      }
    } catch (error) {
      // Continuar con estrategia alternativa
    }
    
    // Estrategia 4: Búsqueda más amplia por categorías de deportes
    try {
      const categoryResponse = await axios.get(
        `https://api.foursquare.com/v3/places/search`,
        {
          params: {
            ll: `${lat},${lon}`,
            radius: radiusInMeters * 3,
            categories: '10000,10001,10045', // Recreación, Deportes, Actividades al aire libre
            limit: 50,
            sort: 'DISTANCE'
          },
          headers: {
            'Authorization': apiKey,
            'Accept': 'application/json'
          }
        }
      );
      
      if (categoryResponse.data?.results?.length > 0) {
        // Filtrar resultados potencialmente relevantes
        const potentialFields = categoryResponse.data.results.filter((place: any) => {
          const name = (place.name || '').toLowerCase();
          const keywords = ['sport', 'field', 'pitch', 'futbol', 'soccer', 'football', 'deportivo', 'estadio'];
          return keywords.some(keyword => name.includes(keyword));
        });
        
        if (potentialFields.length > 0) {
          return mapFoursquareToFootballFields(potentialFields, lat, lon);
        }
      }
    } catch (error) {
      // Estrategia final fallida
    }
    
    // No se encontraron campos
    return [];
  } catch (error) {
    console.error('Error fetching football fields:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('API response status:', error.response.status);
      console.error('API response data:', error.response.data);
    }
    throw error;
  }
};

/**
 * Transforma los resultados de la API de Foursquare al formato interno de campos de fútbol
 */
const mapFoursquareToFootballFields = (places: any[], defaultLat: number, defaultLon: number): FootballField[] => {
  return places.map((place: any, index: number) => {
    return {
      id: (place.fsq_id || `field-${index + 1}`).toString(),
      FieldInfo: {
        Name: place.name || 'Campo de fútbol',
        Address: place.location?.address || 'Dirección no disponible',
        City: place.location?.locality || place.location?.region || 'Ciudad no disponible',
        Postcode: place.location?.postcode || 'CP no disponible',
        Latitude: place.geocodes?.main?.latitude || defaultLat,
        Longitude: place.geocodes?.main?.longitude || defaultLon
      },
      Features: place.categories?.map((category: any) => ({
        FeatureType: {
          Name: category.name || 'Característica'
        }
      })) || [],
      PricePerHour: place.price ? getPriceInfo(place.price) : 'Consultar',
      SurfaceType: getFieldSurfaceType(place),
      IsIndoor: place.indoor === true || false,
      HasLighting: detectHasLighting(place)
    };
  });
};

/**
 * Determina la información de precios basada en los datos de Foursquare
 */
const getPriceInfo = (priceData: any): string => {
  if (typeof priceData === 'object' && priceData.tier) {
    switch (priceData.tier) {
      case 1: return 'Económico';
      case 2: return 'Precio moderado';
      case 3: return 'Precio elevado';
      case 4: return 'Precio muy elevado';
      default: return 'Consultar';
    }
  }
  return 'Consultar';
};

/**
 * Determina el tipo de superficie del campo basado en metadatos disponibles
 */
const getFieldSurfaceType = (place: any): string => {
  if (place.categories) {
    for (const category of place.categories) {
      const name = category.name?.toLowerCase() || '';
      if (name.includes('turf') || name.includes('artificial')) {
        return 'Artificial Turf';
      }
      if (name.includes('grass') || name.includes('natural')) {
        return 'Natural Grass';
      }
    }
  }
  
  const name = place.name?.toLowerCase() || '';
  if (name.includes('turf') || name.includes('artificial') || name.includes('synthetic')) {
    return 'Artificial Turf';
  }
  if (name.includes('grass') || name.includes('natural')) {
    return 'Natural Grass';
  }
  
  return 'No especificado';
};

/**
 * Detecta si un campo tiene iluminación basado en su nombre
 */
const detectHasLighting = (place: any): boolean => {
  const name = place.name?.toLowerCase() || '';
  return name.includes('light') || name.includes('lighted') || name.includes('iluminado') || name.includes('nocturno');
};

/**
 * Obtiene la ubicación actual del usuario usando la API de Geolocalización del navegador
 */
export const getCurrentLocation = (): Promise<{lat: number, lon: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada por tu navegador'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Usuario denegó la solicitud de geolocalización'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Información de ubicación no disponible'));
            break;
          case error.TIMEOUT:
            reject(new Error('Tiempo de espera agotado para obtener la ubicación'));
            break;
          default:
            reject(new Error('Error desconocido al obtener la ubicación'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Obtiene el nombre de la ciudad a partir de coordenadas usando OpenStreetMap Nominatim
 */
export const getCityFromCoordinates = async (lat: number, lon: number): Promise<GeocodingResult> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat: lat,
          lon: lon,
          format: 'json',
          zoom: 10, // Nivel de zoom para ciudad
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'SportifFieldsApp/1.0',
          'Accept-Language': 'es,en'
        },
        timeout: 5000
      }
    );
    
    if (response.data) {
      const location = response.data;
      
      // Extraer el nombre de lugar más específico disponible
      const placeName = 
        location.address?.city || 
        location.address?.town || 
        location.address?.village || 
        location.address?.suburb ||
        location.address?.municipality ||
        location.address?.county ||
        'Ubicación actual';
      
      return {
        name: placeName,
        lat: parseFloat(lat.toString()),
        lon: parseFloat(lon.toString()),
        country: location.address?.country || '',
        region: location.address?.state || location.address?.county || ''
      };
    }
    
    throw new Error('No se pudo determinar la ciudad');
  } catch (error) {
    console.error('Error getting city from coordinates:', error);
    // Devolver objeto básico solo con las coordenadas
    return {
      name: 'Ubicación actual',
      lat: lat,
      lon: lon,
      country: '',
      region: ''
    };
  }
};