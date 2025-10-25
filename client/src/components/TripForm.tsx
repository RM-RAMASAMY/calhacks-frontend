import { useState } from "react";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface TripFormProps {
  onGenerate: (location: string, startDate: string, endDate: string) => void;
}

export function TripForm({ onGenerate }: TripFormProps) {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && startDate && endDate) {
      onGenerate(location, startDate, endDate);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold font-serif mb-2">Plan Your Perfect Journey</h2>
          <p className="text-muted-foreground text-sm">
            Enter your destination and travel dates to create a personalized itinerary
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                data-testid="input-location"
                type="text"
                placeholder="e.g., Paris, France"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-date"
                data-testid="input-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-sm font-medium">End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="end-date"
                data-testid="input-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          data-testid="button-generate"
          className="w-full md:w-auto rounded-full px-8"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Itinerary
        </Button>
      </form>
    </Card>
  );
}
