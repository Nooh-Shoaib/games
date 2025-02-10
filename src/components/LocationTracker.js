import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleLogin } from "@react-oauth/google";

const LocationTracker = () => {
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      localStorage.setItem("google_token", response.access_token);
      startTracking();
    },
    onError: (error) => {
      setError("Failed to login with Google");
      setIsLoading(false);
    },
  });

  const startTracking = () => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          setError("Error getting location: " + error.message);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  };

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "12px",
  };

  const defaultCenter = {
    lat: 0,
    lng: 0,
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : !position ? (
        <div className="text-center">
          <button
            onClick={() => login()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login with Google to Track Location
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={position || defaultCenter}
            zoom={15}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {position && <Marker position={position} />}
          </GoogleMap>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Current Location</h2>
            <p>Latitude: {position?.lat.toFixed(6)}</p>
            <p>Longitude: {position?.lng.toFixed(6)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
