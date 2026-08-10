import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../lib/utils';
import { LocateFixed } from 'lucide-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    label?: string;
    color?: 'gold' | 'red' | 'green';
  }>;
  routePoints?: Array<{ lat: number; lng: number }>;
  className?: string;
  showUserLocation?: boolean;
}

const LocationMarker = ({ showUserLocation }: { showUserLocation?: boolean }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!showUserLocation) return;
    
    map.locate().on('locationfound', function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map, showUserLocation]);

  if (!position) return null;

  const userIcon = L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_0_4px_rgba(59,130,246,0.3)] animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>Your current location</Popup>
    </Marker>
  );
};

export const MapView = ({
  center = [28.6139, 77.2090],
  zoom = 15,
  markers = [],
  routePoints = [],
  className,
  showUserLocation = false,
}: MapViewProps) => {
  
  const getIconForColor = (color?: 'gold' | 'red' | 'green') => {
    let bgColor = 'bg-blue-500'; // fallback
    if (color === 'gold') bgColor = 'bg-nooraya-champagne-gold';
    if (color === 'red') bgColor = 'bg-nooraya-emergency-red';
    if (color === 'green') bgColor = 'bg-emerald-500';

    return L.divIcon({
      className: 'bg-transparent border-none',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 ${bgColor} opacity-20 rounded-full animate-ping"></div>
          <div class="relative w-4 h-4 ${bgColor} border-2 border-white rounded-full shadow-lg"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  return (
    <div className={cn("relative w-full h-full rounded-2xl overflow-hidden shadow-xl border border-nooraya-champagne-gold/20", className)}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {routePoints.length > 0 && (
          <Polyline 
            positions={routePoints.map(p => [p.lat, p.lng])} 
            color="#D4AF37" 
            weight={4} 
            opacity={0.8}
            dashArray="10, 10"
          />
        )}

        {markers.map((marker, i) => (
          <Marker 
            key={i} 
            position={[marker.lat, marker.lng]}
            icon={marker.color ? getIconForColor(marker.color) : new L.Icon.Default()}
          >
            {marker.label && <Popup className="font-body">{marker.label}</Popup>}
          </Marker>
        ))}

        <LocationMarker showUserLocation={showUserLocation} />
      </MapContainer>
      
      {showUserLocation && (
        <div className="absolute bottom-4 right-4 z-[400]">
           <button className="p-3 bg-white text-nooraya-charcoal rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <LocateFixed size={20} />
           </button>
        </div>
      )}
    </div>
  );
};
