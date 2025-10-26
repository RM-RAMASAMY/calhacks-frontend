import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import type { ItineraryEvent } from "@shared/schema";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet - no glow
const icon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233b82f6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232563eb;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23grad)' stroke='%23fff' stroke-width='2' d='M16 0C7.2 0 0 7.2 0 16c0 12 16 32 16 32S32 28 32 16C32 7.2 24.8 0 16 0z'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23fff'/%3E%3C/svg%3E",
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [1, -42],
  shadowSize: [48, 48],
  className: 'marker-no-glow'
});

// Orange marker for restaurant recommendations
const restaurantRecommendationIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='44' viewBox='0 0 28 44'%3E%3Cdefs%3E%3ClinearGradient id='gradOrange' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fb923c;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f97316;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23gradOrange)' stroke='%23fff' stroke-width='2' d='M14 0C6.3 0 0 6.3 0 14c0 10.5 14 30 14 30S28 24.5 28 14C28 6.3 21.7 0 14 0z'/%3E%3Cpath d='M 9 8 L 9 18 M 11 8 L 11 12 L 11 18 M 13 8 L 13 12 L 13 18 M 15 8 Q 15 11 17 11 L 17 18 M 17 11 Q 19 11 19 8' stroke='%23fff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  iconSize: [28, 44],
  iconAnchor: [14, 44],
  popupAnchor: [1, -38],
  className: 'marker-restaurant'
});

// Green marker for hotel recommendations
const hotelRecommendationIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='44' viewBox='0 0 28 44'%3E%3Cdefs%3E%3ClinearGradient id='gradGreen' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2334d399;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2322c55e;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23gradGreen)' stroke='%23fff' stroke-width='2' d='M14 0C6.3 0 0 6.3 0 14c0 10.5 14 30 14 30S28 24.5 28 14C28 6.3 21.7 0 14 0z'/%3E%3Cpath d='M 8 10 L 8 18 L 20 18 L 20 10 M 10 10 L 10 7 L 18 7 L 18 10 M 11 12 L 11 14 M 14 12 L 14 14 M 17 12 L 17 14' stroke='%23fff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  iconSize: [28, 44],
  iconAnchor: [14, 44],
  popupAnchor: [1, -38],
  className: 'marker-hotel'
});

// Purple marker for activity/entertainment
const activityRecommendationIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='44' viewBox='0 0 28 44'%3E%3Cdefs%3E%3ClinearGradient id='gradPurple' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23a78bfa;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23gradPurple)' stroke='%23fff' stroke-width='2' d='M14 0C6.3 0 0 6.3 0 14c0 10.5 14 30 14 30S28 24.5 28 14C28 6.3 21.7 0 14 0z'/%3E%3Ccircle cx='14' cy='11' r='2' fill='%23fff'/%3E%3Cpath d='M 14 13 L 14 18 M 10 15 L 14 15 L 18 15' stroke='%23fff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  iconSize: [28, 44],
  iconAnchor: [14, 44],
  popupAnchor: [1, -38],
  className: 'marker-activity'
});

// Cyan marker for transit/flight
const transitRecommendationIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='44' viewBox='0 0 28 44'%3E%3Cdefs%3E%3ClinearGradient id='gradCyan' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2322d3ee;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2306b6d4;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23gradCyan)' stroke='%23fff' stroke-width='2' d='M14 0C6.3 0 0 6.3 0 14c0 10.5 14 30 14 30S28 24.5 28 14C28 6.3 21.7 0 14 0z'/%3E%3Cpath d='M 9 14 L 19 14 M 14 9 L 14 19 M 11 11 L 14 9 L 17 11' stroke='%23fff' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
  iconSize: [28, 44],
  iconAnchor: [14, 44],
  popupAnchor: [1, -38],
  className: 'marker-transit'
});

// Highlighted marker for hovered events - no glow, blue color to match primary
const highlightedIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='60' viewBox='0 0 40 60'%3E%3Cdefs%3E%3ClinearGradient id='gradHighlight' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233b82f6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232563eb;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23gradHighlight)' stroke='%23fff' stroke-width='3' d='M20 0C9 0 0 9 0 20c0 15 20 40 20 40S40 35 40 20C40 9 31 0 20 0z'/%3E%3Ccircle cx='20' cy='20' r='8' fill='%23fff'/%3E%3Canimation attributeName='opacity' values='1;0.8;1' dur='1.5s' repeatCount='indefinite'/%3E%3C/svg%3E",
  iconSize: [40, 60],
  iconAnchor: [20, 60],
  popupAnchor: [1, -54],
  className: 'highlighted-marker'
});

interface NearbyPlace {
  id: string;
  name: string;
  type: "restaurant" | "hotel" | "activity" | "transit";
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
  } else if (event.type === "activity") {
    return [
      {
        id: `nearby-1-${event.id}`,
        name: "Alternative Tour",
        type: "activity",
        coordinates: [lat + offset * 0.6, lng + offset * 0.4],
        rating: 4.6,
        distance: "0.3 km"
      },
      {
        id: `nearby-2-${event.id}`,
        name: "Similar Attraction",
        type: "activity",
        coordinates: [lat - offset * 0.4, lng + offset * 0.7],
        rating: 4.5,
        distance: "0.7 km"
      }
    ];
  } else if (event.type === "flight" || event.type === "transit") {
    return [
      {
        id: `nearby-1-${event.id}`,
        name: "Alternative Route",
        type: "transit",
        coordinates: [lat + offset * 0.3, lng + offset * 0.5],
        rating: 4.4,
        distance: "0.5 km"
      }
    ];
  } else if (event.type === "entertainment") {
    return [
      {
        id: `nearby-1-${event.id}`,
        name: "Alternative Venue",
        type: "activity",
        coordinates: [lat + offset * 0.5, lng + offset * 0.6],
        rating: 4.7,
        distance: "0.4 km"
      },
      {
        id: `nearby-2-${event.id}`,
        name: "Similar Event",
        type: "activity",
        coordinates: [lat - offset * 0.6, lng + offset * 0.3],
        rating: 4.5,
        distance: "0.6 km"
      }
    ];
  }
  
  return [];
}

interface TravelMapProps {
  events: ItineraryEvent[];
  hoveredEvent?: ItineraryEvent | null;
}

function MapController({ events, hoveredEvent, nearbyPlaces }: { 
  events: ItineraryEvent[]; 
  hoveredEvent?: ItineraryEvent | null;
  nearbyPlaces: NearbyPlace[];
}) {
  const map = useMap();

  // Only set bounds on initial load
  useEffect(() => {
    if (events.length > 0) {
      const bounds = L.latLngBounds(events.map(e => e.coordinates));
      // Massive left and top padding to push all markers to lower right triangle
      map.fitBounds(bounds, { 
        paddingTopLeft: [600, 280],
        paddingBottomRight: [100, 100],
        animate: false
      });
    }
  }, [events, map]);

  // Smooth zoom on hover with proper synchronization
  useEffect(() => {
    if (hoveredEvent) {
      // Include nearby places in the bounds to show all alternatives
      const point = hoveredEvent.coordinates;
      const allPoints = [point, ...nearbyPlaces.map(p => p.coordinates)];
      const bounds = L.latLngBounds(allPoints);
      
      // Expand bounds slightly for context
      const expandedBounds = bounds.pad(0.2);
      
      // Use animated fitBounds for smooth zoom with markers
      map.fitBounds(expandedBounds, {
        paddingTopLeft: [600, 280],
        paddingBottomRight: [100, 100],
        maxZoom: 14,
        animate: true,
        duration: 0.8 // Smooth animation duration
      });
    } else if (events.length > 0) {
      // Zoom out to show entire route
      const bounds = L.latLngBounds(events.map(e => e.coordinates));
      map.fitBounds(bounds, { 
        paddingTopLeft: [600, 280],
        paddingBottomRight: [100, 100],
        animate: true,
        duration: 0.8 // Smooth animation duration
      });
    }
  }, [hoveredEvent, events, nearbyPlaces, map]);

  return null;
}

export function TravelMap({ events, hoveredEvent }: TravelMapProps) {
  const defaultCenter: [number, number] = events.length > 0 
    ? events[0].coordinates 
    : [48.8566, 2.3522];

  const pathCoordinates = events.map(e => e.coordinates);
  
  // Generate nearby recommendations for ALL event types when hovering
  const nearbyPlaces: NearbyPlace[] = hoveredEvent
    ? generateNearbyPlaces(hoveredEvent)
    : [];

  return (
    <div className="h-full w-full rounded-l-xl overflow-hidden relative transition-transform duration-700 ease-out" data-testid="map-container">
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
        <MapController events={events} hoveredEvent={hoveredEvent} nearbyPlaces={nearbyPlaces} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenZooming={false}
          keepBuffer={2}
        />
        
        {/* Clean route path without blur */}
        {pathCoordinates.length > 1 && (
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: "#000000",
              weight: 3,
              opacity: 0.6,
              dashArray: "10, 10",
              dashOffset: "0",
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}
        
        {events.map((event, index) => {
          const isHovered = hoveredEvent?.id === event.id;
          return (
            <Marker
              key={event.id}
              position={event.coordinates}
              icon={isHovered ? highlightedIcon : icon}
              zIndexOffset={isHovered ? 1000 : 0}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[220px] scale-in">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-base">{event.title}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-primary"></span>
                      {event.time}
                    </p>
                    <p className="text-sm leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {nearbyPlaces.map((place) => {
          // Select the appropriate icon based on place type
          let placeIcon;
          let badgeColor;
          let badgeText;
          
          switch(place.type) {
            case "restaurant":
              placeIcon = restaurantRecommendationIcon;
              badgeColor = "bg-gradient-to-br from-orange-400 to-orange-600";
              badgeText = "🍴 Restaurant";
              break;
            case "hotel":
              placeIcon = hotelRecommendationIcon;
              badgeColor = "bg-gradient-to-br from-green-400 to-green-600";
              badgeText = "🏨 Hotel";
              break;
            case "activity":
              placeIcon = activityRecommendationIcon;
              badgeColor = "bg-gradient-to-br from-purple-400 to-purple-600";
              badgeText = "🎯 Activity";
              break;
            case "transit":
              placeIcon = transitRecommendationIcon;
              badgeColor = "bg-gradient-to-br from-cyan-400 to-cyan-600";
              badgeText = "🚗 Transit";
              break;
            default:
              placeIcon = restaurantRecommendationIcon;
              badgeColor = "bg-gradient-to-br from-orange-400 to-orange-600";
              badgeText = "📍 Location";
          }
          
          return (
            <Marker
              key={place.id}
              position={place.coordinates}
              icon={placeIcon}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[200px] scale-in">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`${badgeColor} text-white rounded-full px-3 py-1 text-xs font-bold shadow-md`}>
                      {badgeText}
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-2">{place.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{place.rating}</span>
                    </span>
                    <span className="text-muted-foreground text-xs">{place.distance} away</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
