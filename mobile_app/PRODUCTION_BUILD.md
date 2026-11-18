# PustakTracker Mobile App - Production Build Guide

## Building for Production

This guide provides instructions for building the Flutter mobile app for production deployment.

### Prerequisites

- Flutter SDK installed
- Android SDK (for Android builds) or Xcode (for iOS builds)
- Valid SSL certificate for your backend API (HTTPS required)
- Backend API URL configured

### Environment Configuration

The mobile app uses build-time constants that can be overridden via command-line arguments.

**Available build-time variables:**
- `API_BASE_URL`: Backend API base URL (required in production)
- `ALLOW_BAD_CERTS`: Allow bad certificates (ONLY for development with self-signed certs, never in production)

### Building for Android

#### Release Build (Production)

```bash
flutter build apk \
  --release \
  --dart-define=API_BASE_URL=https://api.yourdomain.com \
  --dart-define=ALLOW_BAD_CERTS=false
```

#### App Bundle (for Play Store)

```bash
flutter build appbundle \
  --release \
  --dart-define=API_BASE_URL=https://api.yourdomain.com \
  --dart-define=ALLOW_BAD_CERTS=false
```

**Output location**: `build/app/outputs/flutter-apk/app-release.apk` or `build/app/outputs/bundle/release/app-release.aab`

### Building for iOS

#### Release Build (Production)

```bash
flutter build ios \
  --release \
  --dart-define=API_BASE_URL=https://api.yourdomain.com \
  --dart-define=ALLOW_BAD_CERTS=false
```

#### Archive for App Store

```bash
flutter build ios \
  --release=true \
  --dart-define=API_BASE_URL=https://api.yourdomain.com \
  --dart-define=ALLOW_BAD_CERTS=false

# Then open in Xcode to submit to App Store
open ios/Runner.xcworkspace
```

### Development Build (with self-signed certificates)

⚠️ **For development/testing ONLY:**

```bash
flutter build apk \
  --debug \
  --dart-define=API_BASE_URL=http://192.168.1.100:5000 \
  --dart-define=ALLOW_BAD_CERTS=true
```

### Configuration in Code

The build-time environment variables are configured in:
- `lib/core/config/api_config.dart` - Base URL configuration
- `lib/data/services/api_service.dart` - SSL verification settings

**Do NOT hardcode URLs in production code** - use the command-line arguments above.

### Pre-Production Checklist

- [ ] `API_BASE_URL` points to production backend with HTTPS
- [ ] `ALLOW_BAD_CERTS=false` (never true in production)
- [ ] SSL certificates from trusted CA (not self-signed)
- [ ] All debug prints removed from code
- [ ] App properly signs requests with bearer tokens
- [ ] Error messages don't expose internal API details
- [ ] No hardcoded credentials or test data
- [ ] Performance tested on actual devices
- [ ] Logs don't contain sensitive information
- [ ] App compiled in release mode (not debug)

### Testing the Build

After building, test on actual device:

```bash
# Install on connected device
flutter install -v

# Test authentication
flutter run --release
```

### Troubleshooting

**SSL Certificate errors:**
- Ensure backend API uses valid HTTPS certificate
- Certificate must be from trusted CA (not self-signed in production)
- Verify certificate is valid: `openssl x509 -in cert.pem -text -noout`

**API connection errors:**
- Verify `API_BASE_URL` matches backend server address
- Ensure both frontend and mobile app have backend domain in their configurations
- Check network connectivity: try `curl https://your-api-url/api/books/available`

**Build failures:**
- Run `flutter clean` before rebuilding
- Update dependencies: `flutter pub upgrade`
- Check Flutter version: `flutter --version`

### Upload to App Stores

**Play Store (Android):**
1. Build App Bundle: `flutter build appbundle --release ...`
2. Upload `app-release.aab` to Google Play Console
3. Set up store listing and testing

**App Store (iOS):**
1. Build and open Xcode: `flutter build ios --release ...` + `open ios/Runner.xcworkspace`
2. Select "Any iOS Device (arm64)" as build target
3. Product → Archive
4. Distribute with App Store Connect
5. Complete TestFlight testing and submit for review
