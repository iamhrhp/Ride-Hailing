# Security Fix - Exposed API Keys

## 🚨 Urgent Action Required

Your Google Maps API key and other credentials were exposed in the GitHub repository.

## What Was Exposed

1. **Google Maps API Key**: `AIzaSyCN9RMQ-M79lgEVBHvNFGObFagLORaQLbU`
2. **Another Google API Key**: `AIzaSyBH2B1IGoHXfUTfkv-kJiSh0RRcJZfBDus`
3. **Razorpay Test Key**: `rzp_test_ty410dtUIacM8N`

## Immediate Steps

### 1. Revoke and Regenerate Keys (Do This First!)

#### Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find and revoke the exposed API keys:
   - `AIzaSyCN9RMQ-M79lgEVBHvNFGObFagLORaQLbU`
   - `AIzaSyBH2B1IGoHXfUTfkv-kJiSh0RRcJZfBDus`
3. Generate new API keys
4. Set up API key restrictions:
   - Restrict to specific Android bundle ID: `com.gaadisathi.gaadisathi`
   - Restrict to specific APIs (Maps, Location, Auth)

#### Razorpay Dashboard:
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
2. Revoke the test key: `rzp_test_ty410dtUIacM8N`
3. Generate a new test key

### 2. Update Your Local Files

The `.gitignore` has been updated to prevent future commits. Now you need to:

1. Create your local config files using the example templates:
   ```bash
   # API Keys
   copy src\config\keys.example.ts src\config\keys.ts
   
   # Firebase configs
   copy android\app\google-services.json.example android\app\google-services.json
   copy android\google-services.json.example android\google-services.json
   ```

2. Edit these new files and add your newly generated API keys

3. Download fresh `google-services.json` files from Firebase Console

### 3. Remove Keys from Git History (If Already Pushed)

If you've already pushed to GitHub, the keys are exposed. You need to remove them from Git history:

**Option A: Using BFG Repo Cleaner (Recommended)**
```bash
# Install BFG Repo Cleaner from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**Option B: Using git filter-branch**
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch 'src/config/keys.ts' 'android/app/google-services.json' 'android/google-services.json'" \
  --prune-empty --tag-name-filter cat -- --all
```

**Warning**: This rewrites Git history. All collaborators need to re-clone the repository.

### 4. Set Up Environment Variables (Optional but Recommended)

For production builds, consider using environment variables:

Create a `.env` file in the project root:
```env
GOOGLE_MAPS_API_KEY=your_new_key_here
RAZORPAY_KEY_ID=your_new_key_here
```

Install react-native-config to use it:
```bash
npm install react-native-config
```

## What's Been Done

✅ Updated `.gitignore` to exclude sensitive files  
✅ Created `keys.example.ts` template  
✅ Created `google-services.json.example` templates  
✅ Created documentation in `src/config/README.md`

## Prevention for Future

- ✅ Sensitive files are now in `.gitignore`
- ✅ Use `.example` files as templates
- ✅ Never commit real API keys
- ✅ Consider using environment variables for production
- ✅ Set up API key restrictions in cloud consoles

## Important Notes

- The old keys in Git history will remain there until you clean the history
- Anyone who cloned your repo before this fix still has the keys
- Consider the compromised keys as public information
- Monitor your API usage for unauthorized access

