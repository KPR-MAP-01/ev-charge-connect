import { useState, useEffect } from "react";

interface GeoState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation not supported", loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
        setState((s) => ({
          ...s,
          error: err.message,
          loading: false,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return state;
}
