# Configuration Files - Security Setup

## ⚠️ Security Notice

**DO NOT commit sensitive API keys to GitHub!**

This directory contains configuration files that may include sensitive API keys. These files are excluded from version control via `.gitignore`.

## Setup Instructions

### 1. API Keys Configuration

1. Copy the example file:
   ```bash
   cp src/config/keys.example.ts src/config/keys.ts
   ```

2. Open `src/config/keys.ts` and replace the placeholder values with your actual API keys:
   - Replace `YOUR_RAZORPAY_KEY_ID_HERE` with your Razorpay key
   - Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your Google Maps API key

### 2. Firebase Configuration (Android)

1. Copy the example file:
   ```bash
   cp android/app/google-services.json.example android/app/google-services.json
   cp android/google-services.json.example android/google-services.json
   ```

2. Download your actual `google-services.json` from:
   - [Firebase Console](https://console.firebase.google.com)
   - Go to Project Settings > General
   - Select your Android app
   - Download `google-services.json`
   - Replace the content in both locations

### 3. Firebase Configuration (iOS)

1. Download your iOS `GoogleService-Info.plist` from Firebase Console
2. Place it in the `ios/RideHailingApp/` directory

## What's Ignored

The following files are excluded from version control:
- `src/config/keys.ts`
- `android/app/google-services.json`
- `android/google-services.json`
- `ios/GoogleService-Info.plist`
- `.env`, `.env.local`, `.env.production`

## Exposed Keys - Action Required! 🚨

If you previously committed your actual API keys, you need to:

1. **Immediately revoke and regenerate all exposed keys**:
   - Google Cloud Console: [Credentials](https://console.cloud.google.com/apis/credentials)
   - Razorpay Dashboard: [API Keys](https://dashboard.razorpay.com/app/keys)

2. **Remove keys from Git history** (if they were pushed to GitHub):
   ```bash
   # Use BFG Repo Cleaner or git filter-branch
   # This will rewrite your Git history
   ```

3. **Update your keys** using the instructions above

## Best Practices

1. ✅ Use environment variables for production
2. ✅ Never commit real API keys to version control
3. ✅ Use `.example` files as templates
4. ✅ Rotate API keys regularly
5. ✅ Set up API key restrictions in cloud consoles
