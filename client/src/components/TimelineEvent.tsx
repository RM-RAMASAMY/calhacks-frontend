import { Plane, Home, UtensilsCrossed, Music, Car, MapPin } from "lucide-react";
import type { EventType } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface TimelineEventProps {
  title: string;
  type: EventType;
  time: string;
  location: string;
  description: string;
  duration: string;
  isLast?: boolean;
  onHover?: (isHovering: boolean) => void;
}

const iconMap: Record<EventType, React.ComponentType<{ className?: string }>> = {
  flight: Plane,
  accommodation: Home,
  food: UtensilsCrossed,
  entertainment: Music,
  transit: Car,
  activity: MapPin,
};

const typeColors: Record<EventType, string> = {
  flight: "bg-primary/10 text-primary border-primary/20",
  accommodation: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  food: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  entertainment: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  transit: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  activity: "bg-chart-1/10 text-chart-1 border-chart-1/20",
};

export function TimelineEvent({
  title,
  type,
  time,
  location,
  description,
  duration,
  isLast = false,
  onHover,
}: TimelineEventProps) {
  const Icon = iconMap[type];

  return (
    <div 
      className="relative pl-8 pb-8 group"
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      data-testid={`event-${type}`}
    >
      {!isLast && (
        <div className="absolute left-[23px] top-12 bottom-0 w-0.5 bg-border" />
      )}
      
      <div className={`absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center ${typeColors[type]} border transition-transform group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      
      <div className="ml-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg" data-testid="text-event-title">{title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium" data-testid="text-event-time">{time}</p>
            <Badge variant="secondary" className="mt-1">
              {duration}
            </Badge>
          </div>
        </div>
        
        <p className="text-sm text-foreground/80 leading-relaxed" data-testid="text-event-description">
          {description}
        </p>
      </div>
    </div>
  );
}
