// API Keys Configuration
// Store sensitive keys in environment variables in production

export const API_KEYS = {
  // Razorpay Test Key
  RAZORPAY_KEY_ID: 'rzp_test_ty410dtUIacM8N',
  
  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: 'AIzaSyCN9RMQ-M79lgEVBHvNFGObFagLORaQLbU',
  
  // Add other API keys here as needed
};

// Environment check for production
export const isProduction = __DEV__ === false;

// Get API key based on environment
export const getRazorpayKey = () => {
  if (isProduction) {
    // In production, use environment variable
    return process.env.RAZORPAY_KEY_ID || API_KEYS.RAZORPAY_KEY_ID;
  }
  return API_KEYS.RAZORPAY_KEY_ID;
};

export const getGoogleMapsKey = () => {
  if (isProduction) {
    // In production, use environment variable
    return process.env.GOOGLE_MAPS_API_KEY || API_KEYS.GOOGLE_MAPS_API_KEY;
  }
  return API_KEYS.GOOGLE_MAPS_API_KEY;
};



