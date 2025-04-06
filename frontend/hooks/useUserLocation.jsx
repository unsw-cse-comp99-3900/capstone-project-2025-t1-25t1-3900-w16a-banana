import { useEffect, useState } from "react";
import useDialog from "./useDialog";
import useToast from "./useToast";
import { fetchLocationDetailFromCoordinate } from "../utils/location";
import useAuth from "./useAuth";

// fallback location: UNSW campus coordinates
const UNSW_LOCATION = { lat: -33.9173, lng: 151.2313 };

export default function useUserLocation() {
  const { showDialog } = useDialog();
  const { showToast } = useToast();

  const [location, setLocation] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  useEffect(() => {
    const successfulCallback = async (position) => {
      const { latitude, longitude } = position.coords;
      const detail = await fetchLocationDetailFromCoordinate(latitude, longitude);
      setLocation({ lat: latitude, lng: longitude });
      setLocationDetails(detail);
    };

    const errorCallback = (error) => {
      console.error("Location error:", error);
      showDialog({
        title: "Location Access Needed",
        message: "We couldn't access your current location. Would you like to use UNSW Sydney as your location for nearby restaurants?",
        onConfirm: async () => {
          const detail = await fetchLocationDetailFromCoordinate(
            UNSW_LOCATION.lat,
            UNSW_LOCATION.lng
          );

          setLocation(UNSW_LOCATION);
          setLocationDetails(detail);
        },
        confirmText: "Use UNSW",
        cancelText: "Cancel",
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(successfulCallback, errorCallback, options);
    } else {
      showToast({
        type: "error",
        message: "Geolocation is not supported by this browser.",
      });
      setLocation(UNSW_LOCATION);
    }
  }, []);

  return { location, locationDetails };
}
