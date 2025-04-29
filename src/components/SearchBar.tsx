import React, { useState, useRef, useEffect } from 'react';
import '../components/components.css';

/**
 * Props para el componente de barra de búsqueda
 */
interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationRequest?: () => void;
}

/**
 * Componente de barra de búsqueda para ciudades con historial de búsquedas recientes
 */
const SearchBar = ({ onSearch, onLocationRequest }: SearchBarProps) => {
  // Estados
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentCitySearches');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Referencias
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  /**
   * Detecta clics fuera del componente para cerrar el dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  /**
   * Guarda las búsquedas recientes en localStorage
   */
  useEffect(() => {
    localStorage.setItem('recentCitySearches', JSON.stringify(recentSearches));
  }, [recentSearches]);
  
  /**
   * Maneja el envío del formulario de búsqueda
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };
  
  /**
   * Procesa la búsqueda y actualiza el historial
   */
  const handleSearch = (city: string) => {
    // Añadir a búsquedas recientes si no existe
    if (!recentSearches.includes(city)) {
      setRecentSearches(prev => [city, ...prev.slice(0, 4)]);
    } else {
      // Mover al principio si ya existe
      setRecentSearches(prev => [
        city,
        ...prev.filter(item => item !== city)
      ].slice(0, 5));
    }
    
    setQuery(city);
    setIsFocused(false);
    onSearch(city);
  };
  
  /**
   * Maneja la selección de una búsqueda reciente
   */
  const handleRecentSelect = (city: string) => {
    handleSearch(city);
  };
  
  /**
   * Limpia el historial de búsquedas recientes
   */
  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recentCitySearches');
  };

  /**
   * Maneja la solicitud de ubicación actual
   */
  const handleLocationRequest = () => {
    if (onLocationRequest) {
      onLocationRequest();
    }
  };
  
  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar ciudad (ej: Barcelona, Madrid, Londres)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="search-input"
          />
          {query && (
            <button 
              type="button" 
              className="clear-button"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          Buscar
        </button>
        {onLocationRequest && (
          <button 
            type="button" 
            className="location-button"
            onClick={handleLocationRequest}
            title="Usar mi ubicación actual"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="1"></circle>
              <line x1="12" y1="2" x2="12" y2="4"></line>
              <line x1="12" y1="20" x2="12" y2="22"></line>
              <line x1="2" y1="12" x2="4" y2="12"></line>
              <line x1="20" y1="12" x2="22" y2="12"></line>
            </svg>
          </button>
        )}
      </form>
      
      {isFocused && recentSearches.length > 0 && (
        <div ref={dropdownRef} className="recent-searches">
          <div className="recent-searches-header">
            <span>Búsquedas recientes</span>
            <button 
              className="clear-all-button" 
              onClick={clearRecentSearches}
            >
              Borrar todo
            </button>
          </div>
          <ul className="recent-list">
            {recentSearches.map((city, index) => (
              <li 
                key={index} 
                onClick={() => handleRecentSelect(city)}
                className="recent-item"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="9 14 4 9 9 4"></polyline>
                  <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                </svg>
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 