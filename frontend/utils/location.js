import axios from "axios";
import { GOOGLE_API_KEY } from "../constants/map";

/**
 * Fetch detailed location info (suburb, postcode, state) based on latitude and longitude.
 * Use the Google Maps API.
 *
 * @param {number} lat - Latitude of the coordinate.
 * @param {number} lng - Longitude of the coordinate.
 * @returns {Promise<{suburb: string, postcode: string, state: string, lat: number, lng: number} | null>} 
 *          An object with location details, or null if the lookup fails.
 */
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

/**
 * Fetch coordinate info (lat, lng) based on a full address, use the Google Maps API.
 *
 * @param {Object} addressDict - Object containing address fields.
 * @param {string} addressDict.address - Street address.
 * @param {string} addressDict.suburb - Suburb name.
 * @param {string} addressDict.state - State abbreviation.
 * @param {string} addressDict.postcode - Postal code.
 * @returns {Promise<{suburb: string, postcode: string, state: string, lat: number, lng: number} | null>}
 *          An object with coordinates and location details, or null if the lookup fails.
 * 
 * input address dict {address, suburb, state, postcode}
 * output: {longitude, latitude, suburb, postcode, state}
 */
export async function fetchLocationDetailFromAddress(addressDict) {
  // write the dict to string
  const { address, suburb, state, postcode } = addressDict;
  const addressString = `${address}, ${suburb}, ${state}, ${postcode}`;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];
    const lat = result.geometry.location.lat;
    const lng = result.geometry.location.lng;

    return { suburb, postcode, state, lat, lng };
  } catch (error) {
    console.error("Error in fetchLocationDetailFromAddress:", error);
    return null;
  }
}

/**
 * Calculate the straight-line distance in kilometers between two geographic coordinates.
 *
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} - Distance in kilometers.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  // convert all to float
  const toFloat = (value) => parseFloat(value);
  lat1 = toFloat(lat1);
  lon1 = toFloat(lon1);
  lat2 = toFloat(lat2);
  lon2 = toFloat(lon2);

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
