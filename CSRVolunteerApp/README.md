# CSR Volunteer Matching Mobile App

A React Native mobile application for the CSR Volunteer Matching System that connects corporate volunteers with people in need.

## Features

### 🔐 Authentication
- User registration and login
- Role-based access (PIN, CSR Rep, Admin)
- JWT token authentication
- Secure password validation

### 👤 PIN (Person-in-Need) Features
- Create and manage help requests
- Track request views and shortlist counts
- View volunteer interest analytics
- Complete request history with filtering
- Profile management

### 🏢 CSR Representative Features
- Search volunteer opportunities
- Advanced filtering by category, urgency, location
- Shortlist/favorite requests
- Create matches with PINs
- Track volunteer history
- Profile management

### 👨‍💼 Admin Features
- Manage service categories
- Company management
- Generate reports
- Platform analytics

## Prerequisites

Before running this app, make sure you have:

1. **Node.js** (v16 or higher)
2. **React Native CLI** or **Expo CLI**
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development, macOS only)
5. **Backend API** running on `http://localhost:8080`

## Installation

1. **Install Node.js dependencies:**
   ```bash
   cd CSRVolunteerApp
   npm install
   ```

2. **Install React Native CLI (if not already installed):**
   ```bash
   npm install -g react-native-cli
   ```

3. **For iOS (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Android
```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

### iOS (macOS only)
```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

## Configuration

### Backend API URL
Update the API base URL in `src/services/api.ts`:
```typescript
private baseURL = 'http://YOUR_BACKEND_URL:8080';
```

### For Physical Device Testing
If testing on a physical device, update the API URL to use your computer's IP address:
```typescript
private baseURL = 'http://192.168.1.100:8080'; // Replace with your IP
```

## Project Structure

```
CSRVolunteerApp/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── navigation/         # Navigation configuration
│   ├── screens/           # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── pin/           # PIN-specific screens
│   │   ├── csr/           # CSR Rep screens
│   │   └── admin/         # Admin screens
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions and themes
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
└── package.json
```

## Key Dependencies

- **React Native**: 0.72.6
- **React Navigation**: Navigation library
- **React Native Paper**: Material Design components
- **Axios**: HTTP client for API calls
- **AsyncStorage**: Local storage
- **React Native Vector Icons**: Icon library
- **React Native Date Picker**: Date selection
- **React Native Picker Select**: Dropdown selection

## API Integration

The app integrates with the backend API through the `ApiService` class in `src/services/api.ts`. All API calls are centralized and include:

- Authentication handling
- Token management
- Error handling
- Request/response interceptors

## Authentication Flow

1. User registers/logs in
2. JWT token is stored in AsyncStorage
3. Token is automatically included in API requests
4. Token validation on app startup
5. Automatic logout on token expiration

## Role-Based Navigation

The app automatically shows different navigation based on user role:
- **PIN**: Home, Requests, History, Profile
- **CSR Rep**: Home, Search, Shortlist, Matches, Profile
- **Admin**: Dashboard, Companies, Categories, Reports, Profile

## Development Notes

### Adding New Screens
1. Create screen component in appropriate folder
2. Add to navigation stack
3. Update types if needed
4. Add API service methods if required

### Styling
- Uses React Native Paper theme system
- Consistent color scheme defined in `src/utils/theme.ts`
- Material Design principles

### State Management
- Context API for global state (Auth)
- Local state for component-specific data
- AsyncStorage for persistence

## Troubleshooting

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
   - Check backend is running
   - Verify API URL in `api.ts`
   - Check network connectivity

### Debug Mode
Enable debug mode in React Native:
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Select "Debug" to open Chrome DevTools

## Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
1. Open `ios/CSRVolunteerApp.xcworkspace` in Xcode
2. Select "Generic iOS Device" or specific device
3. Product → Archive

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review React Native documentation
3. Check backend API status
4. Create an issue in the repository



