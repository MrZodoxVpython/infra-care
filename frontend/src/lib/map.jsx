import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export function MapClicker({ onClick }) {
  const map = useMap();

  useEffect(() => {
    const handler = (event) => onClick(event);
    map.on('click', handler);
    return () => map.off('click', handler);
  }, [map, onClick]);

  return null;
}
