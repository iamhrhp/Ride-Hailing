# Google Sign-In Setup Guide

This guide will help you set up Google Sign-In for your React Native ride-hailing app.

## Prerequisites

1. A Google Cloud Console account
2. A Firebase project
3. Android Studio (for Android setup)
4. Xcode (for iOS setup)

## Step 1: Google Cloud Console Setup

### 1.1 Create a Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

### 1.2 Enable Google Sign-In API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sign-In API" and enable it
3. Also enable "Google+ API" if available

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" for the application type
4. Add your domain (for development, you can use localhost)
5. Note down the **Client ID** - this is your `WEB_CLIENT_ID`

### 1.4 Create Android Credentials
1. In the same "Credentials" section, click "Create Credentials" > "OAuth 2.0 Client IDs"
2. Choose "Android" for the application type
3. Enter your package name: `com.gaadisathi.gaadisathi`
4. Get your SHA-1 fingerprint:
   ```bash
   # For debug keystore
   keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
5. Enter the SHA-1 fingerprint
6. Note down the **Client ID** - this is your `ANDROID_CLIENT_ID`

### 1.5 Create iOS Credentials (Optional)
1. Create another OAuth 2.0 Client ID
2. Choose "iOS" for the application type
3. Enter your bundle ID: `com.gaadisathi.gaadisathi`
4. Note down the **Client ID** - this is your `IOS_CLIENT_ID`

## Step 2: Firebase Configuration

### 2.1 Enable Google Sign-In in Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Authentication" > "Sign-in method"
4. Enable "Google" as a sign-in provider
5. Enter your Web Client ID from Step 1.3
6. Save the configuration

### 2.2 Download Configuration Files
1. Download `google-services.json` for Android
2. Download `GoogleService-Info.plist` for iOS
3. Place them in the appropriate directories:
   - `android/app/google-services.json`
   - `ios/GaadiSathi/GoogleService-Info.plist`

## Step 3: Update Configuration Files

### 3.1 Update Google Sign-In Configuration
Edit `src/config/googleSignIn.ts` and replace the placeholder values:

```typescript
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID_HERE',
    iosClientId: 'YOUR_ACTUAL_IOS_CLIENT_ID_HERE', // Optional
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
  });
};
```

### 3.2 Update Android Configuration
Add the following to `android/app/build.gradle`:

```gradle
dependencies {
    // ... existing dependencies
    implementation 'com.google.android.gms:play-services-auth:20.4.1'
}
```

### 3.3 Update iOS Configuration
Add the following to `ios/Podfile`:

```ruby
pod 'GoogleSignIn'
```

Then run:
```bash
cd ios && pod install
```

## Step 4: Test the Implementation

### 4.1 Test on Android
1. Run the app on Android emulator or device
2. Try the Google Sign-In button
3. Check the console for any errors

### 4.2 Test on iOS
1. Run the app on iOS simulator or device
2. Try the Google Sign-In button
3. Check the console for any errors

## Troubleshooting

### Common Issues

1. **"DEVELOPER_ERROR" on Android**
   - Make sure your SHA-1 fingerprint is correct
   - Ensure the package name matches exactly

2. **"Sign in failed" on iOS**
   - Make sure you've added the URL scheme to Info.plist
   - Check that the bundle ID matches your Firebase project

3. **"Web client ID not found"**
   - Verify the webClientId in your configuration
   - Make sure it matches the one from Google Cloud Console

4. **"Google Play Services not available"**
   - This is normal on emulators
   - Test on a real device for full functionality

### Debug Steps

1. Check console logs for detailed error messages
2. Verify all configuration files are in place
3. Ensure all dependencies are properly installed
4. Test with a real Google account

## Security Notes

1. Never commit your actual client IDs to version control
2. Use environment variables for production
3. Regularly rotate your API keys
4. Monitor usage in Google Cloud Console

## Additional Resources

- [Google Sign-In for React Native](https://github.com/react-native-google-signin/google-signin)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Console](https://console.firebase.google.com/)

