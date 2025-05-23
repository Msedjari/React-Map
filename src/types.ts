/**
 * Datos meteorológicos
 */
export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    is_day: number;
    uv: number;
  };
}

/**
 * Información de campos de fútbol
 */
export interface SportifField {
  id: string;
  FieldInfo: {
    Name: string;
    Address: string;
    City: string;
    Postcode: string;
    Latitude: number;
    Longitude: number;
  };
  Features: {
    FeatureType: {
      Name: string;
    };
  }[];
  PricePerHour: string;
  SurfaceType: string;
  IsIndoor: boolean;
  HasLighting: boolean;
} 