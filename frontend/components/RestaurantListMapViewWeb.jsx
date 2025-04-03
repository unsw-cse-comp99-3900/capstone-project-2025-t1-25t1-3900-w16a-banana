import React from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  height: '400px',
  width: '100%',
  borderRadius: '12px',
  marginTop: '12px',
};

export default function RestaurantListGoogleMap({ restaurants, userLocation }) {
  // Load the Google Maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyATnj7gIKlNSS8hZdGpV_E3XLOik8OY9tY',
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (!userLocation) return <div>Loading user location...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: userLocation.lat, lng: userLocation.lng }}
      zoom={13}
    >
      {/* Marker for User Location */}
      <Marker position={{ lat: userLocation.lat, lng: userLocation.lng }} />

      {/* Markers for Restaurants */}
      {restaurants &&
        restaurants.map((r) => (
          <Marker
            key={r.id}
            position={{ lat: r.coordinates.lat, lng: r.coordinates.lng }}
            // If you want popups/InfoWindow, you’d add them here:
            // onClick={() => handle marker click}
          >
            {/* 
            You can optionally show an InfoWindow:
            <InfoWindow>
              <div>
                <img
                  src={`http://127.0.0.1:11000/${r.url_img1}`}
                  alt={r.name}
                  style={{ width: "100%", borderRadius: "6px" }}
                />
                <h3 style={{ margin: "8px 0 4px" }}>{r.name}</h3>
                <p>{r.suburb}, {r.state}</p>
                {r.distance && (
                  <p style={{ color: "gray", margin: 0 }}>
                    ~{r.distance.toFixed(1)} km away
                  </p>
                )}
              </div>
            </InfoWindow>
            */}
          </Marker>
        ))}
    </GoogleMap>
  );
}
