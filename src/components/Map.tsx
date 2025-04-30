import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import { LatLngExpression, Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../components/components.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Iconos para los marcadores
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

/**
 * Tipo para los marcadores del mapa
 */
type MarkerType = {
  position: LatLngExpression;
  popup: string;
  type?: 'football' | 'weather';
};

/**
 * Props para el componente principal del mapa
 */
interface MapProps {
  center: LatLngExpression;
  zoom: number;
  markers?: MarkerType[];
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}

/**
 * Props para el componente de vista del mapa
 */
interface SetViewProps {
  center: LatLngExpression;
  zoom: number;
}

/**
 * Componente para actualizar la vista del mapa
 */
const SetViewOnChange = ({ center, zoom }: SetViewProps) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

/**
 * Props para el componente de eventos del mapa
 */
interface MapEventsProps {
  onClick: (latlng: { lat: number; lng: number }) => void;
}

/**
 * Componente para manejar eventos de clic
 */
const MapEvents = ({ onClick }: MapEventsProps) => {
  useMapEvents({
    click: (e) => {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

// Icono de marcador predeterminado
const DefaultIcon = new Icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Icono para marcador de clima
const WeatherIcon = new DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="
      background-color: #3498db;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      box-shadow: 0 0 0 4px white, 0 2px 10px rgba(0,0,0,0.4);
      transition: transform 0.2s ease;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="22px" height="22px">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Icono para marcador de campo de fútbol
const FootballIcon = new DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="
      background-color: #27ae60;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      box-shadow: 0 0 0 4px white, 0 2px 10px rgba(0,0,0,0.4);
      transition: transform 0.2s ease;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="22px" height="22px">
        <circle cx="12" cy="12" r="8.5" fill="white"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#27ae60"/>
        <path d="M12,7 L13.5,10 L17,10.5 L14.5,13 L15,16.5 L12,15 L9,16.5 L9.5,13 L7,10.5 L10.5,10 Z" fill="#27ae60" />
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Estilos del mapa
const mapStyle = {
  height: '100vh',
  width: '100%', 
  position: 'relative' as 'relative',
  zIndex: 1
};

// Estilos para los popups
const customPopupStyle = `
  .leaflet-popup-content-wrapper {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 3px 14px rgba(0,0,0,0.2);
    padding: 4px;
  }
  .leaflet-popup-content {
    margin: 8px 10px;
    font-family: 'Roboto', Arial, sans-serif;
    min-width: 200px;
  }
  .leaflet-popup-tip {
    background-color: white;
    box-shadow: 0 3px 14px rgba(0,0,0,0.2);
  }
  .leaflet-container a.leaflet-popup-close-button {
    color: #777;
    padding: 8px 8px 0 0;
  }
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
  }
  .leaflet-control-zoom a {
    background-color: white !important;
    color: #333 !important;
    border-radius: 4px !important;
    margin-bottom: 5px !important;
  }
  .leaflet-bar {
    border-radius: 8px !important;
    overflow: hidden;
  }
`;

/**
 * Componente del mapa
 */
const Map = ({ center, zoom, markers = [], onMapClick }: MapProps) => {
  // Insertar estilos CSS personalizados
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customPopupStyle;
    
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  /**
   * Selecciona el icono según el tipo de marcador
   */
  const getMarkerIcon = (type?: 'football' | 'weather') => {
    switch (type) {
      case 'weather':
        return WeatherIcon;
      case 'football':
        return FootballIcon;
      default:
        return DefaultIcon;
    }
  };

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={mapStyle}
      zoomControl={false}
      attributionControl={false}
      className="fullscreen-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <ZoomControl position="bottomright" />
      <SetViewOnChange center={center} zoom={zoom} />
      {onMapClick && <MapEvents onClick={onMapClick} />}
      
      {markers.map((marker, idx) => (
        <Marker 
          key={idx} 
          position={marker.position} 
          icon={getMarkerIcon(marker.type)}
        >
          <Popup className="custom-google-maps-popup">
            <div className="custom-popup">
              <h3 className="popup-title">{marker.popup.split(' - ')[0]}</h3>
              <p className="popup-content">{marker.popup.split(' - ')[1]}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map; 