# Testing Guide: Two-Device Testing for Ride Creation and Acceptance

This guide will help you test the ride-hailing app with two devices - one as a passenger (rider/user) and one as a driver.

## Prerequisites

1. **Two physical devices** (phones/tablets) or **one physical device + one emulator**
2. **Firebase project** configured and connected
3. **App installed** on both devices
4. **Internet connection** on both devices
5. **Location permissions** enabled on both devices

## Setup Steps

### Step 1: Prepare Device 1 (Passenger/User)

1. **Install the app** on Device 1
2. **Launch the app**
3. **Sign up or log in** as a **Passenger**:
   - Go to Login Screen
   - Use email/password or Google Sign-In
   - **Important**: Make sure you select **"Passenger"** role during signup
   - Or use test login: `email: test`, `password: test` (defaults to passenger)

### Step 2: Prepare Device 2 (Driver/Rider)

1. **Install the app** on Device 2
2. **Launch the app**
3. **Sign up or log in** as a **Driver**:
   - Go to Login Screen
   - Use a **different email** than Device 1
   - **Important**: Make sure you select **"Rider"** role during signup
   - Or create a new account with a different email

### Step 3: Verify Roles

- **Device 1** should show the **User Home Screen** (passenger view with map)
- **Device 2** should show the **Rider Home Screen** (driver view with online toggle)

## Testing Flow

### Test 1: Basic Ride Creation and Acceptance

#### On Device 1 (Passenger):
1. **Allow location permissions** when prompted
2. **Select pickup location**:
   - Tap on the map or use the search bar
   - Choose a location (e.g., "Times Square, New York")
3. **Select destination**:
   - Tap on the map or use the search bar
   - Choose a different location (e.g., "Central Park, New York")
4. **Select ride type** (if prompted):
   - Choose Economy, Comfort, or Premium
5. **Tap "Search Rider" or "Book Ride"** button
6. **Wait for ride request to be created**
   - You should see a "Searching for driver..." message
   - The app should navigate to RideStatusScreen

#### On Device 2 (Driver):
1. **Go to Rider Home Screen**
2. **Toggle "Online" switch** to ON (top right)
   - You should see "You're Online" message
   - The app will initialize your driver profile
3. **Wait for ride request to appear**
   - Available rides should appear in the "Available Rides" section
   - You should see the ride request from Device 1
4. **Tap on the ride request card** to view details
5. **Tap "Accept Ride" button**
   - Confirm the acceptance
   - You should see "Ride Accepted" message

#### Back on Device 1 (Passenger):
1. **Check RideStatusScreen**
   - Status should change from "Looking for your driver..." to "Driver found!"
   - Driver information should appear (name, rating, vehicle)
   - ETA should be displayed

### Test 2: Real-Time Location Updates

#### On Device 2 (Driver):
1. **After accepting the ride**, the driver location should be tracked
2. **Move around** (if using a physical device) or **simulate location** (if using emulator)
3. **Location updates** should be sent to Firebase

#### On Device 1 (Passenger):
1. **Check RideStatusScreen**
   - Driver location should update in real-time
   - Status should change to "Driver is on the way"
   - Map should show driver's current location

### Test 3: Multiple Rides

1. **Complete or cancel** the current ride
2. **On Device 1**: Create another ride request
3. **On Device 2**: Accept the new ride
4. **Verify** that the new ride appears and can be accepted

## Troubleshooting

### Issue: Driver doesn't see ride requests

**Solutions:**
1. **Check if driver is online**:
   - On Device 2, ensure the "Online" toggle is ON (green)
   - You should see "Online" status in the header

2. **Check location permissions**:
   - Both devices need location permissions enabled
   - Go to device Settings > App > Permissions > Location > Allow

3. **Check distance**:
   - The driver must be within 10km of the pickup location
   - Make sure both devices have similar locations or use location simulation

4. **Check Firebase connection**:
   - Ensure both devices have internet connection
   - Check Firebase console for errors

### Issue: Passenger doesn't see driver after acceptance

**Solutions:**
1. **Check ride status**:
   - On Device 1, check if status changed to "Driver found"
   - If stuck on "Searching", the ride might not have been accepted properly

2. **Check Firebase**:
   - Open Firebase Console > Firestore
   - Check the `rides` collection
   - Verify the ride document has `status: "accepted"` and `driverId` field

3. **Restart the app**:
   - Close and reopen the app on Device 1
   - The real-time listener should reconnect

### Issue: Location not updating

**Solutions:**
1. **Check location services**:
   - Ensure location services are enabled on the device
   - For Android: Settings > Location > On
   - For iOS: Settings > Privacy > Location Services > On

2. **Check app permissions**:
   - Android: Settings > Apps > Your App > Permissions > Location > Allow all the time
   - iOS: Settings > Your App > Location > Always

3. **Check Firebase rules**:
   - Ensure Firestore security rules allow read/write for authenticated users

### Issue: Authentication errors

**Solutions:**
1. **Use different accounts**:
   - Device 1: passenger account (email1@example.com)
   - Device 2: driver account (email2@example.com)

2. **Check Firebase Authentication**:
   - Open Firebase Console > Authentication
   - Verify both users are registered

3. **Clear app data and re-login**:
   - Uninstall and reinstall the app
   - Sign in again with proper roles

## Testing with Emulators

If you're using one physical device and one emulator:

### Android Emulator Setup:
1. **Open Android Studio**
2. **Create/Start an emulator**
3. **Set location** in emulator:
   - Click the "..." button (three dots) in emulator toolbar
   - Go to "Location" tab
   - Set latitude/longitude (e.g., 40.7589, -73.9851 for NYC)

### iOS Simulator Setup:
1. **Open Xcode**
2. **Start a simulator**
3. **Set location**:
   - Features > Location > Custom Location
   - Set latitude/longitude

### Important Notes for Emulators:
- **Use different locations** for passenger and driver (but within 10km)
- **Example**:
  - Passenger: 40.7589, -73.9851 (Times Square)
  - Driver: 40.7829, -73.9654 (Central Park) - about 3km away

## Quick Test Checklist

- [ ] Device 1: App installed and logged in as Passenger
- [ ] Device 2: App installed and logged in as Driver (different account)
- [ ] Device 2: Driver is online (toggle ON)
- [ ] Device 1: Location permissions granted
- [ ] Device 2: Location permissions granted
- [ ] Device 1: Created ride request with pickup and destination
- [ ] Device 2: Ride request appears in Available Rides
- [ ] Device 2: Accepted the ride
- [ ] Device 1: Status changed to "Driver found"
- [ ] Device 1: Driver info displayed
- [ ] Device 2: Location updates being sent
- [ ] Device 1: Real-time location updates received

## Firebase Console Monitoring

While testing, you can monitor the app in Firebase Console:

1. **Firestore Database**:
   - `rides` collection: See all ride requests and their status
   - `drivers` collection: See driver profiles and online status
   - `driverLocations` collection: See real-time driver locations

2. **Authentication**:
   - See all registered users
   - Verify user roles

3. **Realtime Database** (if used):
   - Monitor real-time updates

## Advanced Testing Scenarios

### Test Multiple Drivers:
1. Set up 3 devices: 1 passenger + 2 drivers
2. Passenger creates a ride
3. Both drivers should see the ride request
4. First driver to accept gets the ride
5. Second driver should no longer see the ride

### Test Ride Cancellation:
1. Passenger creates a ride
2. Driver accepts the ride
3. Passenger cancels the ride
4. Driver should be set back to available
5. Ride status should be "cancelled"

### Test Offline/Online Toggle:
1. Driver goes online → should receive ride requests
2. Driver goes offline → should stop receiving requests
3. Driver goes online again → should receive new requests

## Need Help?

If you encounter issues:
1. Check the console logs on both devices
2. Check Firebase Console for errors
3. Verify network connectivity
4. Ensure Firebase configuration is correct on both devices
5. Check that both devices are using the same Firebase project

