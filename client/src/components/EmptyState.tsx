import { Globe, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md px-6">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Globe className="h-24 w-24 text-primary/20" />
            <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2" />
          </div>
        </div>
        <h2 className="text-3xl font-bold font-serif mb-3">
          Plan Your Perfect Journey
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Enter your destination and travel dates above to create a personalized 
          itinerary with an interactive map and detailed timeline.
        </p>
      </div>
    </div>
  );
}
