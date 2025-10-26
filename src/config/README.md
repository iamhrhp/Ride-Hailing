# API Keys Configuration

This directory contains configuration files for API keys used in the RapidoUsers app.

## Files

- `keys.ts` - Contains API keys and configuration functions
- `README.md` - This documentation file

## API Keys

### Razorpay
- **Key ID**: `rzp_test_ty410dtUIacM8N`
- **Environment**: Test (Sandbox)
- **Usage**: Payment processing and online transactions

### Google Maps
- **API Key**: `AIzaSyCN9RMQ-M79lgEVBHvNFGObFagLORaQLbU`
- **Usage**: Maps, Places API, Geocoding, Directions

## Security Notes

⚠️ **IMPORTANT**: Never commit API keys to version control!

- The `keys.ts` file is added to `.gitignore`
- In production, use environment variables
- Rotate keys regularly
- Monitor API usage for security

## Production Setup

1. Create environment variables:
   ```bash
   export RAZORPAY_KEY_ID="your_production_key"
   export GOOGLE_MAPS_API_KEY="your_production_key"
   ```

2. Update the config functions to use environment variables
3. Remove hardcoded keys from the code

## Usage in Code

```typescript
import { getRazorpayKey, getGoogleMapsKey } from '../config/keys';

const razorpayKey = getRazorpayKey();
const mapsKey = getGoogleMapsKey();
```

## Key Rotation

- Rotate API keys every 90 days
- Monitor for unauthorized usage
- Keep backup keys for emergency access



