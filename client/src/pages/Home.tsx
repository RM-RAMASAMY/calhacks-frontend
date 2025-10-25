import { useState } from "react";
import { TripForm } from "@/components/TripForm";
import { Timeline } from "@/components/Timeline";
import { TravelMap } from "@/components/TravelMap";
import { EmptyState } from "@/components/EmptyState";
import { generateMockItinerary } from "@/lib/mockData";
import type { Itinerary } from "@shared/schema";

export default function Home() {
  // Initialize with a default itinerary (Paris trip)
  const [itinerary, setItinerary] = useState<Itinerary | null>(() => 
    generateMockItinerary("Paris", "2025-11-01", "2025-11-05")
  );
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const handleGenerate = (location: string, startDate: string, endDate: string) => {
    // TODO: remove mock functionality - replace with API call
    const mockItinerary = generateMockItinerary(location, startDate, endDate);
    setItinerary(mockItinerary);
  };

  const hoveredEvent = hoveredEventId 
    ? itinerary?.events.find(e => e.id === hoveredEventId) 
    : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Full screen map background */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {itinerary ? (
          <>
            {/* Map takes full screen - behind all panels */}
            <main className="absolute inset-0 bg-muted overflow-hidden z-0">
              <TravelMap 
                events={itinerary.events}
                hoveredEvent={hoveredEvent}
              />
            </main>

            {/* Floating top search panel */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-3 pointer-events-none">
              <div className="bg-card/95 backdrop-blur-lg rounded-lg shadow-lg border border-border/50 pointer-events-auto">
                <div className="px-3 py-2">
                  <TripForm onGenerate={handleGenerate} />
                </div>
              </div>
            </div>

            {/* Floating left panel - increased top margin to avoid overlap */}
            <div className="absolute left-3 top-20 bottom-3 z-40 w-full max-w-[320px] lg:max-w-[360px] pointer-events-none">
              <div className="h-full bg-card/95 backdrop-blur-lg rounded-lg shadow-lg border border-border/50 overflow-y-auto overflow-x-hidden pointer-events-auto">
                <Timeline 
                  events={itinerary.events}
                  onEventHover={setHoveredEventId}
                />
              </div>
            </div>
          </>
        ) : (
          <main className="flex-1 overflow-hidden">
            <EmptyState />
          </main>
        )}
      </div>
    </div>
  );
}
