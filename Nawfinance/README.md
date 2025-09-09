# My Wallet App - React Native

A complete financial wallet application built with React Native and Expo, featuring Google Sheets integration for data storage and Google Apps Script as backend.

## Features

### 🎯 Core Functionality
- **Complete Onboarding Flow**: 4-step setup process with app configuration, currency selection, and API setup
- **Transaction Management**: Add, view, and manage income and expenses
- **Real-time Balance**: Dynamic balance calculation with transaction history
- **Category System**: Pre-defined categories for better expense tracking
- **Analytics Dashboard**: Visual charts and graphs for financial insights

### 📱 User Interface
- **Modern Design**: Clean, intuitive interface with green theme
- **Responsive Layout**: Works on both mobile and web platforms
- **Tab Navigation**: Easy navigation between Home, Analytics, and Settings
- **Interactive Charts**: Pie charts and bar graphs for data visualization

### 🔧 Technical Features
- **Google Sheets Integration**: Uses Google Sheets as database
- **Google Apps Script Backend**: Server-side logic via Apps Script
- **Local Storage**: AsyncStorage for offline data persistence
- **Multi-language Support**: Configurable localization
- **Currency Support**: Multiple currency options (USD, EUR, GBP, JPY, BRL)

## Project Structure

```
WalletApp/
├── App.js                          # Main app component
├── src/
│   ├── navigation/
│   │   └── MainTabNavigator.js     # Tab and stack navigation
│   ├── screens/
│   │   ├── OnboardingScreen.js     # Welcome screen
│   │   ├── AppConfigScreen.js      # App configuration
│   │   ├── ApiConfigScreen.js      # Google Sheets API setup
│   │   ├── CompletionScreen.js     # Setup completion
│   │   ├── HomeScreen.js           # Main dashboard
│   │   ├── AnalyticsScreen.js      # Charts and analytics
│   │   ├── SettingsScreen.js       # App settings
│   │   ├── AddTransactionScreen.js # Add new transactions
│   │   └── TransactionListScreen.js # Transaction history
│   ├── services/
│   │   └── GoogleSheetsService.js  # Google Sheets API integration
│   └── utils/
│       └── StorageUtils.js         # Local storage utilities
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v20+)
- npm or yarn
- Expo CLI
- Google account for Sheets integration

### Local Development

1. **Clone and Install**
   ```bash
   cd WalletApp
   npm install
   ```

2. **Install Web Dependencies**
   ```bash
   npx expo install react-dom react-native-web @expo/metro-runtime
   ```

3. **Start Development Server**
   ```bash
   npm run web    # For web development
   npm start      # For mobile (scan QR code with Expo Go)
   ```

### Google Sheets Setup

1. **Create Google Sheet**
   - Create a new Google Sheet
   - Set up columns: Date, Description, Amount, Type, Category, Remarks

2. **Create Apps Script**
   - Go to Extensions > Apps Script
   - Create functions for CRUD operations
   - Deploy as web app
   - Copy the deployment URL

3. **Configure App**
   - Run the app and complete onboarding
   - Paste your Apps Script URL in the API Configuration step
   - Test connection

## Dependencies

### Core Dependencies
- `expo` - React Native framework
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/stack` - Stack navigation
- `react-native-screens` - Native screen components
- `react-native-safe-area-context` - Safe area handling

### UI & Charts
- `react-native-chart-kit` - Chart components
- `react-native-svg` - SVG support for charts
- `@expo/vector-icons` - Icon library

### Storage & HTTP
- `@react-native-async-storage/async-storage` - Local storage
- Built-in fetch API for HTTP requests

## Usage

### First Time Setup
1. Launch the app
2. Complete the 4-step onboarding process:
   - Welcome screen
   - App configuration (name, currency, locale)
   - API configuration (Google Apps Script URL)
   - Setup completion

### Adding Transactions
1. Go to Home screen
2. Tap "Add Income" or "Add Expense"
3. Fill in transaction details
4. Select appropriate category
5. Save transaction

### Viewing Analytics
1. Navigate to Analytics tab
2. View monthly income/expense summary
3. Analyze spending by category
4. Review detailed breakdowns

### Managing Settings
1. Go to Settings tab
2. Modify app preferences
3. Update categories
4. Reset configuration if needed

## Customization

### Adding New Categories
Edit the category arrays in the respective screen files to add custom categories for income and expenses.

### Changing Theme Colors
Update the color values throughout the components to match your preferred theme.

### Modifying Charts
The analytics screen uses react-native-chart-kit. Refer to their documentation for customization options.

## Google Apps Script Backend

Your Google Apps Script should handle these endpoints:
- `GET` - Retrieve transactions
- `POST` - Add new transaction
- `PUT` - Update transaction
- `DELETE` - Remove transaction

Example Apps Script structure:
```javascript
function doGet(e) {
  // Handle GET requests
}

function doPost(e) {
  // Handle POST requests
}
```

## Deployment

### Web Deployment
The app can be deployed as a web application using Expo's web build system.

### Mobile App
Use Expo's build service to create APK/IPA files for distribution.

## Troubleshooting

### Common Issues
1. **Navigation not working**: Ensure all navigation dependencies are installed
2. **Charts not displaying**: Check react-native-svg installation
3. **Google Sheets connection failed**: Verify Apps Script URL and permissions
4. **Storage issues**: Clear AsyncStorage if needed

### Development Tips
- Use Expo Go app for quick mobile testing
- Check browser console for web debugging
- Verify Google Apps Script permissions
- Test with sample data first

## License

This project is created for educational and personal use. Modify as needed for your requirements.

## Support

For issues related to:
- React Native/Expo: Check official documentation
- Google Sheets API: Refer to Google's developer docs
- Chart components: See react-native-chart-kit documentation

