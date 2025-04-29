import { FootballField } from '../types';
import '../components/components.css';

/**
 * Props para el componente de lista de campos de deportes
 */
interface FootballFieldsListProps {
  fields: FootballField[];
  isLoading: boolean;
  error: string | null;
  onFieldSelect: (field: FootballField) => void;
}

/**
 * Tipo para las características de un campo
 */
type FeatureItem = {
  FeatureType: {
    Name: string;
  };
};

/**
 * Componente que muestra una lista de campos de deportes cercanos
 */
const FootballFieldsList = ({ 
  fields,
  isLoading,
  error,
  onFieldSelect
}: FootballFieldsListProps) => {
  // Estado de carga
  if (isLoading) {
    return (
      <div className="fields-list loading">
        <div className="loading-spinner"></div>
        <p>Buscando campos de fútbol cercanos...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="fields-list error">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Estado sin campos encontrados
  if (fields.length === 0) {
    return (
      <div className="fields-list empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <p>No se encontraron campos de fútbol cercanos.<br />Prueba otra ubicación.</p>
      </div>
    );
  }

  // Renderizar la lista de campos
  return (
    <div className="fields-list">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
        Campos de Fútbol Cercanos
        <span className="fields-count">{fields.length}</span>
      </h3>
      <div className="fields">
        {fields.map(field => (
          <div 
            key={field.id} 
            className="field-item"
            onClick={() => onFieldSelect(field)}
          >
            {/* Cabecera del campo */}
            <div className="field-header">
              <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                </svg>
                {field.FieldInfo.Name}
              </h4>
              <div className="distance-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Ver</span>
              </div>
            </div>
            
            {/* Dirección del campo */}
            <div className="field-address">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <p>{field.FieldInfo.Address}</p>
                <p>{field.FieldInfo.City}, {field.FieldInfo.Postcode}</p>
              </div>
            </div>
            
            {/* Características del campo */}
            <div className="field-features">
              {field.Features.map((feature: FeatureItem, idx: number) => (
                <span key={idx} className="feature-type">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  {feature.FeatureType.Name}
                </span>
              ))}
            </div>
            
            {/* Detalles técnicos del campo */}
            <div className="field-details">
              <div className="surface-type">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3 L21 21"></path>
                  <path d="M21 3 L3 21"></path>
                </svg>
                <span>Superficie: {field.SurfaceType}</span>
              </div>
              
              <div className="field-attributes">
                {field.IsIndoor && (
                  <span className="field-attribute indoor">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                    </svg>
                    Cubierto
                  </span>
                )}
                
                {field.HasLighting && (
                  <span className="field-attribute lighting">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    Iluminación
                  </span>
                )}
              </div>
            </div>
            
            {/* Información de precio */}
            <div className="cost-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <strong>Precio:</strong> {field.PricePerHour || 'No especificado'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootballFieldsList; 