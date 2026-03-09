import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapView } from "@/components/MapView";
import { Loader } from "@/components/Loader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

export default function MapPage() {
  const navigate = useNavigate();

  const { data: stations, isLoading } = useQuery({
    queryKey: ["stations-map"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stations").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleStationClick = (station: Tables<"stations">) => {
    navigate(`/bookings?station=${station.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-4rem)]"
    >
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-4">Charging Map</h1>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader text="Loading map..." />
          </div>
        ) : (
          <MapView
            stations={stations || []}
            onStationClick={handleStationClick}
            className="h-[calc(100vh-12rem)] rounded-xl shadow-lg"
          />
        )}
      </div>
    </motion.div>
  );
}
