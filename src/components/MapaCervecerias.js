import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet-draw';

function MapaCervecerias() {
  const [userLocation, setUserLocation] = useState(null);
  const initialPosition = [-26.8241, -65.2226];
  const initialZoom = 13;
  const mapRef = useRef(null);
  const drawControlRef = useRef(null);
  const [cerveceriasEncontradas, setCerveceriasEncontradas] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
        }
      );
    } else {
      console.log("La geolocalización no es compatible con este navegador.");
    }
  }, []);

  const MapWithUserLocation = () => {
    const map = useMap();
    useEffect(() => {
      if (userLocation) {
        map.setView(userLocation, 15); // Centrar en la ubicación del usuario con zoom 15
        L.marker(userLocation).addTo(map).bindPopup("Tu ubicación").openPopup();
      }
    }, [map]);
    return null;
  };

  const MapWithDrawing = () => {
    const map = useMap();
    const drawnItems = useRef(new L.FeatureGroup());

    useEffect(() => {
      if (map) {
        map.addLayer(drawnItems.current);

        const drawControl = new L.Control.Draw({
          draw: {
            polygon: false,
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false,
            rectangle: true,
          },
          edit: {
            featureGroup: drawnItems.current,
          },
        });
        map.addControl(drawControl);
        drawControlRef.current = drawControl;

        map.on(L.Draw.Event.CREATED, (event) => {
          const layer = event.layer;
          drawnItems.current.addLayer(layer);
          const bounds = layer.getBounds();
          const northEast = bounds.getNorthEast();
          const southWest = bounds.getSouthWest();
          console.log("Límites del rectángulo:", northEast, southWest);
          buscarCerveceriasEnArea(northEast, southWest);
        });

        map.on(L.Draw.Event.EDITED, (event) => {
          const layers = event.layers;
          layers.eachLayer((layer) => {
            const bounds = layer.getBounds();
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();
            console.log("Límites editados:", northEast, southWest);
            buscarCerveceriasEnArea(northEast, southWest);
          });
        });

        map.on(L.Draw.Event.DELETED, (event) => {
          console.log("Figura eliminada");
        });
      }

      return () => {
        if (map && drawControlRef.current) {
          map.removeControl(drawControlRef.current);
          map.off(L.Draw.Event.CREATED);
          map.off(L.Draw.Event.EDITED);
          map.off(L.Draw.Event.DELETED);
        }
      };
    }, [map]);

    return null;
  };

  const buscarCerveceriasEnArea = async (northEast, southWest) => {
    try {
      const response = await fetch(
        `/api/Cervecerias/BuscarCerveceriasEnRectangulo?northEastLat=${northEast.lat}&northEastLng=${northEast.lng}&southWestLat=${southWest.lat}&southWestLng=${southWest.lng}`
      );

      if (!response.ok) {
        console.error('Error al buscar cervecerías:', response.status);
        return;
      }

      const data = await response.json();
      console.log("Cervecerías encontradas:", data);
      mostrarCerveceriasEnMapa(data);
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
    }
  };

  const mostrarCerveceriasEnMapa = (cervecerias) => {
    setCerveceriasEncontradas(cervecerias);
  };

  return (
    <MapContainer
      center={userLocation || initialPosition}
      zoom={userLocation ? 15 : initialZoom}
      style={{ height: '400px', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && <MapWithUserLocation />} {/* Renderiza el componente para centrar */}
      {userLocation && <MapWithDrawing />}
      {cerveceriasEncontradas.map((cerveceria) => (
        <Marker
          key={cerveceria.id}
          position={[cerveceria.latitud, cerveceria.longitud]}
        >
          <Popup>
            {cerveceria.nombre} <br /> {cerveceria.direccion}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapaCervecerias;