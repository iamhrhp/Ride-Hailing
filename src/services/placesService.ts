import { getGoogleMapsKey } from '../config/keys';

export interface PlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface AutocompleteResponse {
  predictions: Array<{
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }>;
  status: string;
}

export interface PlaceDetailsResponse {
  result: {
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    name: string;
  };
  status: string;
}

class PlacesService {
  private apiKey: string;
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor() {
    this.apiKey = getGoogleMapsKey();
  }

  /**
   * Search for places using Google Places Autocomplete API
   * Searches for ALL place types: establishments, shops, homes, street addresses, etc.
   * Just like Rapido and Ola apps
   * @param input - The search query text
   * @param location - Optional current location to bias search results (latitude, longitude)
   */
  async searchPlaces(input: string, location?: { latitude: number; longitude: number }): Promise<PlaceResult[]> {
    try {
      if (!input || input.length < 2) {
        return [];
      }

      const encodedInput = encodeURIComponent(input);
      
      // Build URL with location bias if available
      let url = `${this.baseUrl}/place/autocomplete/json?input=${encodedInput}&components=country:in&key=${this.apiKey}`;
      
      // Add location bias to prioritize results near the user's current location
      if (location) {
        url += `&location=${location.latitude},${location.longitude}&radius=50000`;
      }

      const response = await fetch(url);
      const data: AutocompleteResponse = await response.json();

      if (data.status === 'OK' && data.predictions) {
        // Fetch geometry for all results to get accurate coordinates
        const results = await Promise.all(
          data.predictions.slice(0, 10).map(async (prediction) => {
            const details = await this.getPlaceDetails(prediction.place_id);
            
            // Log for debugging
            if (!details || !details.geometry) {
              console.warn(`No details found for place_id: ${prediction.place_id}, name: ${prediction.structured_formatting.main_text}`);
              // Return null to filter out results without valid coordinates
              return null;
            }
            
            console.log(`Place details for ${prediction.structured_formatting.main_text}:`, {
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng,
            });
            
            return {
              place_id: prediction.place_id,
              description: prediction.description,
              structured_formatting: prediction.structured_formatting,
              geometry: details.geometry,
            };
          })
        );

        // Filter out any null results (places where details fetch failed)
        const validResults = results.filter((result): result is PlaceResult => result !== null);
        
        console.log(`Places search results: ${validResults.length} valid out of ${results.length} total`);
        return validResults;
      }

      return [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  /**
   * Get detailed information about a place using Place ID
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResponse['result'] | null> {
    try {
      const url = `${this.baseUrl}/place/details/json?place_id=${placeId}&fields=formatted_address,geometry,name&key=${this.apiKey}`;

      console.log('Fetching place details for:', placeId);
      const response = await fetch(url);
      const data: PlaceDetailsResponse = await response.json();

      console.log('Place details response:', data);

      if (data.status === 'OK' && data.result) {
        console.log('Place details geometry:', data.result.geometry);
        return data.result;
      }

      console.warn('Place details API returned status:', data.status);
      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  /**
   * Get place details by coordinates (reverse geocoding)
   */
  async getPlaceFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }

      return null;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  }

  /**
   * Get route directions using Google Directions API
   * Returns an array of coordinates following the actual road route
   */
  async getDirections(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): Promise<Array<{ latitude: number; longitude: number }> | null> {
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destStr = `${destination.latitude},${destination.longitude}`;
      
      const url = `${this.baseUrl}/directions/json?origin=${originStr}&destination=${destStr}&key=${this.apiKey}`;

      console.log('Fetching directions from:', originStr, 'to:', destStr);
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.routes && data.routes.length > 0) {
        // Get the first route
        const route = data.routes[0];
        const coordinates: Array<{ latitude: number; longitude: number }> = [];

        // Decode the polyline to get coordinates
        route.legs.forEach((leg: any) => {
          leg.steps.forEach((step: any) => {
            // Decode polyline from step
            const decoded = this.decodePolyline(step.polyline.points);
            coordinates.push(...decoded);
          });
        });

        console.log('✅ Directions fetched with', coordinates.length, 'points');
        return coordinates.length > 0 ? coordinates : null;
      }

      console.warn('Directions API returned status:', data.status);
      return null;
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }

  /**
   * Decode Google's encoded polyline string to coordinates
   * Algorithm from: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
   */
  private decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
    const coordinates: Array<{ latitude: number; longitude: number }> = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) !== 0) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) !== 0) ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      coordinates.push({
        latitude: lat * 1e-5,
        longitude: lng * 1e-5,
      });
    }

    return coordinates;
  }
}

const placesService = new PlacesService();
export default placesService;

