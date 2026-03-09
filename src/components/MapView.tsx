import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Tables } from "@/integrations/supabase/types";

// Fix default marker icons for Leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const evIcon = L.divIcon({
  html: `<div style="background:hsl(142,71%,45%);width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/></svg></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  className: "",
});

interface MapViewProps {
  stations: Tables<"stations">[];
  center?: [number, number];
  zoom?: number;
  onStationClick?: (station: Tables<"stations">) => void;
  onMapClick?: (lat: number, lng: number) => void;
  selectedPosition?: [number, number] | null;
  className?: string;
}

export function MapView({
  stations,
  center = [20.5937, 78.9629],
  zoom = 5,
  onStationClick,
  onMapClick,
  selectedPosition,
  className = "h-[500px]",
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);

    if (onMapClick) {
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when stations change
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    stations.forEach((station) => {
      const marker = L.marker([station.latitude, station.longitude], { icon: evIcon });
      marker.bindPopup(
        `<div style="font-family:system-ui;min-width:160px">
          <strong style="font-size:14px">${station.name}</strong><br/>
          <span style="color:#666;font-size:12px">⚡ ${station.charger_type}</span><br/>
          <span style="color:#666;font-size:12px">🔌 ${station.available_slots} slots available</span>
        </div>`
      );
      if (onStationClick) {
        marker.on("click", () => onStationClick(station));
      }
      markersRef.current!.addLayer(marker);
    });
  }, [stations, onStationClick]);

  // Handle selected position marker (for admin map picker)
  useEffect(() => {
    if (!mapRef.current) return;
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }
    if (selectedPosition) {
      selectedMarkerRef.current = L.marker(selectedPosition).addTo(mapRef.current);
      mapRef.current.setView(selectedPosition, Math.max(mapRef.current.getZoom(), 12));
    }
  }, [selectedPosition]);

  return <div ref={containerRef} className={`rounded-xl overflow-hidden ${className}`} />;
}
