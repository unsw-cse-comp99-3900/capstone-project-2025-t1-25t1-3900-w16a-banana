import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import useToast from '../hooks/useToast';
import { BACKEND } from '../constants/backend';

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

  const { showToast } = useToast();

  // active marker state: for the restaurant list
  const [activeMarker, setActiveMarker] = useState(null);

  const handleMarkerClick = (id) => {
    activeMarker === id ? setActiveMarker(null) : setActiveMarker(id);
  }

  if (!isLoaded) return <div>Loading...</div>;
  if (!userLocation) return <div>Loading user location...</div>;

  console.log("activeMarker", activeMarker);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: userLocation.lat, lng: userLocation.lng }}
      zoom={13}
    >
      {/* Marker for My Location */}
      <Marker 
        position={{ lat: userLocation.lat, lng: userLocation.lng }}
        onClick={() => {
          showToast("You are here!", "success");
        }}
      />

      {/* Markers for Restaurants */}
      {restaurants &&
        restaurants.map((r) => (
          <Marker
            key={r.id}
            position={{ lat: r.coordinates.lat, lng: r.coordinates.lng }}
            onClick={() => setActiveMarker(r.id)}
          >
            {activeMarker === r.id && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div style={{ width: '250px' }}>
                  <img
                    src={`${BACKEND}/${r.url_img1}`}
                    alt={r.name}
                    style={{ width: '100%', borderRadius: '6px', height: 80, objectFit: 'cover' }}
                  />
                  <h3 style={{ margin: '8px 0 4px' }}>{r.name}</h3>
                  {r.distance && (
                    <p style={{ color: 'gray', margin: 0 }}>
                      ~{r.distance.toFixed(1)} km away
                    </p>
                  )}
                  <button 
                    style={{ marginTop: '8px', padding: '8px 8px', backgroundColor: '#f6f6f6', color: '#0d6efd', border: 'none', borderRadius: '4px' }}
                    onClick={() => console.log('View restaurant', r.id)}
                  >
                    View
                  </button>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
    </GoogleMap>
  );
}
