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
   */
  async searchPlaces(input: string): Promise<PlaceResult[]> {
    try {
      if (!input || input.length < 2) {
        return [];
      }

      const encodedInput = encodeURIComponent(input);
      // Remove 'types' restriction to allow all place types (establishments, shops, homes, etc.)
      const url = `${this.baseUrl}/place/autocomplete/json?input=${encodedInput}&components=country:in&key=${this.apiKey}`;

      const response = await fetch(url);
      const data: AutocompleteResponse = await response.json();

      if (data.status === 'OK' && data.predictions) {
        // Fetch geometry for all results to get accurate coordinates
        const results = await Promise.all(
          data.predictions.slice(0, 10).map(async (prediction) => {
            const details = await this.getPlaceDetails(prediction.place_id);
            
            // Log for debugging
            if (!details) {
              console.warn(`No details found for place_id: ${prediction.place_id}`);
            }
            
            return {
              place_id: prediction.place_id,
              description: prediction.description,
              structured_formatting: prediction.structured_formatting,
              geometry: details?.geometry || {
                location: {
                  lat: 19.0760, // Fallback to Mumbai coordinates
                  lng: 72.8777,
                },
              },
            };
          })
        );

        console.log('Places search results:', results);
        return results;
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
}

const placesService = new PlacesService();
export default placesService;

