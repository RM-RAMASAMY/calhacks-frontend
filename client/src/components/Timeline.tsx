import { TimelineEvent } from "./TimelineEvent";
import type { ItineraryEvent } from "@shared/schema";

interface TimelineProps {
  events: ItineraryEvent[];
  onEventHover?: (eventId: string | null) => void;
}

export function Timeline({ events, onEventHover }: TimelineProps) {
  return (
    <div className="p-3 space-y-1">
      <div className="mb-4">
        <h2 className="text-xl font-bold font-serif" data-testid="text-timeline-title">Your Itinerary</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {events.length} activities planned
        </p>
      </div>
      
      <div className="space-y-0">
        {events.map((event, index) => (
          <TimelineEvent
            key={event.id}
            title={event.title}
            type={event.type}
            time={event.time}
            location={event.location}
            description={event.description}
            duration={event.duration}
            isLast={index === events.length - 1}
            onHover={(isHovering) => 
              onEventHover?.(isHovering ? event.id : null)
            }
          />
        ))}
      </div>
    </div>
  );
}
