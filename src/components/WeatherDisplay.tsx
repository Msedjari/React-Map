import { WeatherData } from '../types';
import '../components/components.css';

/**
 * Props para el componente de visualización del clima
 */
interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Componente que muestra la información meteorológica
 */
const WeatherDisplay = ({ weatherData, isLoading, error }: WeatherDisplayProps) => {
  if (isLoading) {
    return (
      <div className="weather-info loading">
        <div className="loading-spinner"></div>
        <p>Cargando información meteorológica...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-info error">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-info">
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <p>Haz clic en el mapa para ver información meteorológica</p>
        </div>
      </div>
    );
  }

  /**
   * Determina la clase de icono según el código meteorológico
   */
  const getWeatherIconClass = (code: number) => {
    if (code === 1000) return 'sunny-icon'; // Soleado
    if (code >= 1003 && code <= 1030) return 'cloudy-icon'; // Nublado
    if (code >= 1063 && code <= 1201) return 'rainy-icon'; // Lluvia
    if (code >= 1204 && code <= 1225) return 'snowy-icon'; // Nieve
    if (code >= 1273 && code <= 1282) return 'stormy-icon'; // Tormenta
    if (code >= 1135 && code <= 1147) return 'foggy-icon'; // Niebla
    return '';
  };

  return (
    <div className="weather-info">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
        </svg>
        Clima en {weatherData.location.name}
      </h3>
      
      <div className="weather-details">
        <div className="weather-icon">
          {weatherData.current.condition.icon && (
            <img 
              src={weatherData.current.condition.icon.startsWith('//') 
                ? `https:${weatherData.current.condition.icon}` 
                : weatherData.current.condition.icon
              } 
              alt={weatherData.current.condition.text}
              className={getWeatherIconClass(weatherData.current.condition.code)}
            />
          )}
        </div>
        
        <div className="weather-data">
          <div className="weather-temp">
            <span className="temp-value">{Math.round(weatherData.current.temp_c)}°C</span>
            <span className="feels-like">Sensación: {Math.round(weatherData.current.feelslike_c)}°C</span>
          </div>
          
          <p className="weather-condition">
            <strong>{weatherData.current.condition.text}</strong>
          </p>
          
          <div className="weather-details-grid">
            <div className="weather-detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
              <span><strong>Humedad:</strong> {weatherData.current.humidity}%</span>
            </div>
            
            <div className="weather-detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
                <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
                <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
              </svg>
              <span><strong>Viento:</strong> {weatherData.current.wind_kph} km/h</span>
            </div>
            
            <div className="weather-detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <span><strong>UV:</strong> {weatherData.current.uv}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay; 