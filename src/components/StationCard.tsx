import { motion } from "framer-motion";
import { Zap, MapPin, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

interface StationCardProps {
  station: Tables<"stations">;
  index?: number;
}

export function StationCard({ station, index = 0 }: StationCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass rounded-xl p-5 hover:shadow-lg hover:shadow-primary/10 transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">{station.name}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
            </p>
          </div>
        </div>
        <Badge variant={station.available_slots > 0 ? "default" : "destructive"} className="text-xs">
          {station.available_slots > 0 ? `${station.available_slots} slots` : "Full"}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Battery className="h-4 w-4" />
          {station.charger_type}
        </div>
        <Button
          size="sm"
          disabled={station.available_slots <= 0}
          onClick={() => navigate(`/bookings?station=${station.id}`)}
        >
          Book Now
        </Button>
      </div>
    </motion.div>
  );
}
