import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import type { ItineraryEvent } from "@shared/schema";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface TravelMapProps {
  events: ItineraryEvent[];
  hoveredEventId?: string | null;
}

function MapController({ events }: { events: ItineraryEvent[] }) {
  const map = useMap();

  useEffect(() => {
    if (events.length > 0) {
      const bounds = L.latLngBounds(events.map(e => e.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [events, map]);

  return null;
}

export function TravelMap({ events, hoveredEventId }: TravelMapProps) {
  const defaultCenter: [number, number] = events.length > 0 
    ? events[0].coordinates 
    : [48.8566, 2.3522];

  const pathCoordinates = events.map(e => e.coordinates);

  return (
    <div className="h-full w-full rounded-l-xl overflow-hidden" data-testid="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <MapController events={events} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pathCoordinates.length > 1 && (
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: "hsl(204, 94%, 42%)",
              weight: 3,
              opacity: 0.7,
            }}
          />
        )}
        
        {events.map((event, index) => (
          <Marker
            key={event.id}
            position={event.coordinates}
            icon={icon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-sm">{event.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{event.time}</p>
                <p className="text-xs">{event.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
