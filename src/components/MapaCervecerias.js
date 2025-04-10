import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet-draw';
import beerIconUrl from '../assets/icons/beer-icon.png';

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
      if (userLocation && map) {
        map.setView(userLocation, 15);
        L.marker(userLocation).addTo(map).bindPopup("Tu ubicación").openPopup();
      }
    }, [map]);
    return null;
  };

  const MapWithDrawing = () => {
    const map = useMap();
    const drawnItems = useRef(new L.FeatureGroup());

    useEffect(() => {
      if (!map) return;

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

      const handleCreated = (event) => {
        const layer = event.layer;
        drawnItems.current.addLayer(layer);
        const bounds = layer.getBounds();
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        console.log("Límites del rectángulo:", northEast, southWest);
        buscarCerveceriasEnArea(northEast, southWest);
      };

      const handleEdited = (event) => {
        event.layers.eachLayer((layer) => {
          const bounds = layer.getBounds();
          const northEast = bounds.getNorthEast();
          const southWest = bounds.getSouthWest();
          console.log("Límites editados:", northEast, southWest);
          buscarCerveceriasEnArea(northEast, southWest);
        });
      };

      map.on(L.Draw.Event.CREATED, handleCreated);
      map.on(L.Draw.Event.EDITED, handleEdited);
      map.on(L.Draw.Event.DELETED, () => {
        console.log("Figura eliminada");
      });

      return () => {
        map.removeControl(drawControl);
        map.off(L.Draw.Event.CREATED, handleCreated);
        map.off(L.Draw.Event.EDITED, handleEdited);
        map.off(L.Draw.Event.DELETED);
      };
    }, [map]);

    return null;
  };

  const buscarCerveceriasEnArea = async (northEast, southWest) => {
    try {
      const response = await fetch(
        `https://localhost:7060/api/Cervecerias/BuscarCerveceriasEnRectangulo?northEastLat=${northEast.lat}&northEastLng=${northEast.lng}&southWestLat=${southWest.lat}&southWestLng=${southWest.lng}`,
        { headers: { Accept: 'application/json' } }
      );

      if (!response.ok) {
        console.error('Error al buscar cervecerías:', response.status);
        return;
      }

      const data = await response.json();
      console.log("Cervecerías encontradas:", data);
      setCerveceriasEncontradas(data);
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
    }
  };

  const beerIcon = L.icon({
    iconUrl: beerIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'leaflet/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

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
      {userLocation && <MapWithUserLocation />}
      {userLocation && <MapWithDrawing />}
      {cerveceriasEncontradas.map((cerveceria) => {
        /*const puntaje = cerveceria.opiniones.map(opinion => opinion.puntaje);
        const promedioPuntaje = puntaje.length > 0
          ? puntaje.reduce((sum, rating) => sum + rating, 0) / puntaje.length
          : 0;

        const renderEstrellas = (promedio) => {
          const fullStars = Math.floor(promedio);
          const hasHalfStar = promedio % 1 !== 0;
          const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
          let stars = '';
          for (let i = 0; i < fullStars; i++) {
            stars += '★';
          }
          if (hasHalfStar) {
            stars += '½';
          }
          for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
          }
          return stars;
        };*/

        return (
          <Marker
            key={cerveceria.id}
            position={[cerveceria.latitud, cerveceria.longitud]}
            icon={beerIcon}
          >
            <Popup>
              <b>{cerveceria.nombre}</b> <br />
              Dirección: {cerveceria.direccion} <br />
              Precio Promedio: ${cerveceria.precioPromedio}
            </Popup>
          </Marker>
          //Valoración: {renderEstrellas(promedioPuntaje)} ({promedioPuntaje.toFixed(1)})  "Popup"
        );
      })}
    </MapContainer>
  );
}

export default MapaCervecerias;