# CSR Volunteer Matching Mobile App - Setup Guide

## 🚀 Quick Start

### Prerequisites
1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **React Native CLI** - Install with: `npm install -g react-native-cli`
3. **Backend API** running on `http://localhost:8080`

### For Android Development
- **Android Studio** - [Download here](https://developer.android.com/studio)
- **Android SDK** (API level 21 or higher)
- **Java Development Kit (JDK)** 11 or higher

### For iOS Development (macOS only)
- **Xcode** (latest version) - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **CocoaPods** - Install with: `sudo gem install cocoapods`

## 📱 Installation Steps

### 1. Install Dependencies
```bash
cd CSRVolunteerApp
npm install
```

### 2. Install iOS Dependencies (macOS only)
```bash
cd ios && pod install && cd ..
```

### 3. Start Metro Bundler
```bash
npm start
```

### 4. Run the App

#### Android
```bash
# In a new terminal
npm run android
```

#### iOS (macOS only)
```bash
# In a new terminal
npm run ios
```

## 🔧 Configuration

### Backend API URL
Update the API URL in `src/services/api.ts`:
```typescript
private baseURL = 'http://YOUR_BACKEND_IP:8080';
```

### For Physical Device Testing
If testing on a physical device, use your computer's IP address:
```typescript
private baseURL = 'http://192.168.1.100:8080'; // Replace with your IP
```

## 🏗️ Project Structure

```
CSRVolunteerApp/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── navigation/         # Navigation configuration
│   ├── screens/           # Screen components
│   │   ├── auth/          # Login, Register
│   │   ├── pin/           # PIN-specific screens
│   │   ├── csr/           # CSR Rep screens
│   │   └── admin/         # Admin screens
│   ├── services/          # API services
│   ├── types/             # TypeScript definitions
│   └── utils/             # Helpers and themes
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
└── package.json
```

## 🎯 Features Implemented

### ✅ Authentication
- User registration and login
- JWT token management
- Role-based navigation

### ✅ PIN Features
- Create and manage help requests
- View request analytics (views, shortlists)
- Complete request history
- Profile management

### ✅ CSR Rep Features
- Search volunteer opportunities
- Advanced filtering
- Shortlist management
- Match creation and tracking

### ✅ Admin Features
- Service category management
- Company management
- Reporting system

## 🔍 Troubleshooting

### Common Issues

1. **Metro bundler issues:**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues:**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **iOS build issues:**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **API connection issues:**
   - Ensure backend is running on port 8080
   - Check API URL in `src/services/api.ts`
   - Verify network connectivity

### Debug Mode
- **Android**: Shake device or press `Cmd+M`
- **iOS**: Shake device or press `Cmd+D`
- Select "Debug" to open Chrome DevTools

## 📱 Testing

### Emulator/Simulator
- **Android**: Use Android Studio AVD Manager
- **iOS**: Use Xcode Simulator

### Physical Device
1. Enable Developer Options on Android
2. Enable USB Debugging
3. Connect device via USB
4. Run `npm run android`

## 🚀 Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
1. Open `ios/CSRVolunteerApp.xcworkspace` in Xcode
2. Select "Generic iOS Device"
3. Product → Archive

## 📚 Next Steps

1. **Complete remaining screens** - Some screens are placeholder implementations
2. **Add navigation logic** - Connect screen navigation
3. **Implement missing features** - Complete all CRUD operations
4. **Add error handling** - Improve error messages and validation
5. **Add offline support** - Cache data for offline usage
6. **Add push notifications** - Notify users of new matches/requests

## 🆘 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review React Native documentation
3. Ensure backend API is running
4. Check device/emulator logs

## 📄 License

This project is licensed under the MIT License.



