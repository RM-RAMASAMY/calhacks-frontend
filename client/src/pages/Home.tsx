import { useState } from "react";
import { TripForm } from "@/components/TripForm";
import { Timeline } from "@/components/Timeline";
import { TravelMap } from "@/components/TravelMap";
import { EmptyState } from "@/components/EmptyState";
import { generateMockItinerary } from "@/lib/mockData";
import type { Itinerary } from "@shared/schema";

export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const handleGenerate = (location: string, startDate: string, endDate: string) => {
    // TODO: remove mock functionality - replace with API call
    const mockItinerary = generateMockItinerary(location, startDate, endDate);
    setItinerary(mockItinerary);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <TripForm onGenerate={handleGenerate} />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {itinerary ? (
          <>
            <aside className="w-full md:w-[480px] lg:w-[520px] border-r bg-card overflow-hidden">
              <Timeline 
                events={itinerary.events}
                onEventHover={setHoveredEventId}
              />
            </aside>

            <main className="flex-1 bg-muted">
              <TravelMap 
                events={itinerary.events}
                hoveredEventId={hoveredEventId}
              />
            </main>
          </>
        ) : (
          <main className="flex-1">
            <EmptyState />
          </main>
        )}
      </div>
    </div>
  );
}
