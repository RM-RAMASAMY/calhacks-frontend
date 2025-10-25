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

// Orange marker for restaurant recommendations
const restaurantRecommendationIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%23f97316' stroke='%23fff' stroke-width='1' d='M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z'/%3E%3Ccircle cx='12.5' cy='12.5' r='6' fill='%23fff'/%3E%3C/svg%3E",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Green marker for hotel recommendations
const hotelRecommendationIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%2322c55e' stroke='%23fff' stroke-width='1' d='M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z'/%3E%3Ccircle cx='12.5' cy='12.5' r='6' fill='%23fff'/%3E%3C/svg%3E",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface NearbyPlace {
  id: string;
  name: string;
  type: "restaurant" | "hotel";
  coordinates: [number, number];
  rating: number;
  distance: string;
}

// TODO: remove mock functionality - replace with real API calls to get nearby places
function generateNearbyPlaces(event: ItineraryEvent): NearbyPlace[] {
  const [lat, lng] = event.coordinates;
  const offset = 0.01; // roughly 1km
  
  if (event.type === "food") {
    return [
      {
        id: `nearby-1-${event.id}`,
        name: "La Petite Bistro",
        type: "restaurant",
        coordinates: [lat + offset, lng + offset * 0.5],
        rating: 4.5,
        distance: "0.3 km"
      },
      {
        id: `nearby-2-${event.id}`,
        name: "Chez Marie",
        type: "restaurant",
        coordinates: [lat - offset * 0.5, lng + offset],
        rating: 4.7,
        distance: "0.5 km"
      },
      {
        id: `nearby-3-${event.id}`,
        name: "Le Gourmet",
        type: "restaurant",
        coordinates: [lat + offset * 0.7, lng - offset * 0.8],
        rating: 4.3,
        distance: "0.7 km"
      }
    ];
  } else if (event.type === "accommodation") {
    return [
      {
        id: `nearby-1-${event.id}`,
        name: "Grand Hotel Plaza",
        type: "hotel",
        coordinates: [lat + offset * 0.8, lng + offset * 0.6],
        rating: 4.6,
        distance: "0.4 km"
      },
      {
        id: `nearby-2-${event.id}`,
        name: "Boutique Residence",
        type: "hotel",
        coordinates: [lat - offset * 0.6, lng - offset * 0.5],
        rating: 4.8,
        distance: "0.6 km"
      },
      {
        id: `nearby-3-${event.id}`,
        name: "Comfort Suites",
        type: "hotel",
        coordinates: [lat + offset * 0.5, lng - offset * 0.9],
        rating: 4.4,
        distance: "0.8 km"
      }
    ];
  }
  
  return [];
}

interface TravelMapProps {
  events: ItineraryEvent[];
  hoveredEvent?: ItineraryEvent | null;
}

function MapController({ events, hoveredEvent }: { events: ItineraryEvent[]; hoveredEvent?: ItineraryEvent | null }) {
  const map = useMap();

  useEffect(() => {
    if (events.length > 0) {
      const bounds = L.latLngBounds(events.map(e => e.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [events, map]);

  useEffect(() => {
    if (hoveredEvent) {
      map.flyTo(hoveredEvent.coordinates, 15, {
        duration: 0.8,
        easeLinearity: 0.5
      });
    }
  }, [hoveredEvent, map]);

  return null;
}

export function TravelMap({ events, hoveredEvent }: TravelMapProps) {
  const defaultCenter: [number, number] = events.length > 0 
    ? events[0].coordinates 
    : [48.8566, 2.3522];

  const pathCoordinates = events.map(e => e.coordinates);
  
  // Generate nearby recommendations only when hovering over food or accommodation
  const nearbyPlaces: NearbyPlace[] = hoveredEvent && (hoveredEvent.type === "food" || hoveredEvent.type === "accommodation")
    ? generateNearbyPlaces(hoveredEvent)
    : [];

  return (
    <div className="h-full w-full rounded-l-xl overflow-hidden" data-testid="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <MapController events={events} hoveredEvent={hoveredEvent} />
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
        
        {nearbyPlaces.map((place) => (
          <Marker
            key={place.id}
            position={place.coordinates}
            icon={place.type === "restaurant" ? restaurantRecommendationIcon : hotelRecommendationIcon}
          >
            <Popup>
              <div className="p-2 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${place.type === "restaurant" ? "bg-orange-500" : "bg-green-500"} text-white rounded-full px-2 py-0.5 text-xs font-semibold`}>
                    {place.type === "restaurant" ? "Restaurant" : "Hotel"}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1">{place.name}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>⭐ {place.rating}</span>
                  <span>{place.distance} away</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
