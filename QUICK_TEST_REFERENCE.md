# Quick Test Reference Card

## Two-Device Testing Quick Steps

### Device 1 (Passenger) - Create Ride
```
1. Login as Passenger (email: test, password: test)
2. Allow location permissions
3. Select pickup location on map
4. Select destination on map
5. Choose ride type
6. Tap "Search Rider" / "Book Ride"
7. Wait on RideStatusScreen for driver
```

### Device 2 (Driver) - Accept Ride
```
1. Login as Driver (different email account)
2. Go to Rider Home Screen
3. Toggle "Online" switch ON
4. Wait for ride request to appear
5. Tap "Accept Ride" button
6. Confirm acceptance
```

### Expected Results
- ✅ Device 1: Status changes to "Driver found!"
- ✅ Device 1: Driver info appears (name, rating, vehicle)
- ✅ Device 2: Shows "Ride Accepted" message
- ✅ Device 1: Real-time location updates (if driver moves)

## Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Driver doesn't see rides | Toggle Online switch ON, check location permissions |
| Passenger stuck on "Searching" | Check if driver accepted, verify Firebase connection |
| Location not updating | Enable location permissions, check device settings |
| Authentication error | Use different accounts for passenger and driver |

## Test Accounts Setup

**Option 1: Test Login (Quick)**
- Device 1: `email: test`, `password: test` → Passenger
- Device 2: Create new account → Select "Rider" role

**Option 2: Real Accounts**
- Device 1: `passenger@test.com` → Passenger role
- Device 2: `driver@test.com` → Rider role

## Firebase Collections to Monitor

- `rides` - All ride requests (check status: pending → accepted)
- `drivers` - Driver profiles (check isAvailable: true/false)
- `driverLocations` - Real-time driver locations

## Distance Requirements

- Driver must be within **10km** of pickup location
- For testing, use locations close to each other:
  - Example: Times Square (40.7589, -73.9851)
  - Example: Central Park (40.7829, -73.9654) - ~3km away

