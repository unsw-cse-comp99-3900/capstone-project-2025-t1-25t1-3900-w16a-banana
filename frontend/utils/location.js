import axios from "axios";

const GOOGLE_API_KEY = "AIzaSyATnj7gIKlNSS8hZdGpV_E3XLOik8OY9tY";

// input longitude and latitude, 
// output: {longitude, latitude, suburb, postcode, state}
export async function fetchLocationDetailFromCoordinate(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.results || data.results.length === 0) return null;

    const addressComponents = data.results[0].address_components;

    const suburb = addressComponents.find(c => c.types.includes("locality"))?.long_name || "";
    const postcode = addressComponents.find(c => c.types.includes("postal_code"))?.long_name || "";
    const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";

    return { suburb, postcode, state, lat, lng };
  } catch (error) {
    console.error("Error in fetchLocationDetailFromCoordinate:", error);
    return null;
  }
}

// input address string (the more detailed the better)
// output: {longitude, latitude, suburb, postcode, state}
export async function fetchLocationDetailFromAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];
    const addressComponents = result.address_components;
    const lat = result.geometry.location.lat;
    const lng = result.geometry.location.lng;

    const suburb = addressComponents.find(c => c.types.includes("locality"))?.long_name || "";
    const postcode = addressComponents.find(c => c.types.includes("postal_code"))?.long_name || "";
    const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";

    return { suburb, postcode, state, lat, lng };
  } catch (error) {
    console.error("Error in fetchLocationDetailFromAddress:", error);
    return null;
  }
}
