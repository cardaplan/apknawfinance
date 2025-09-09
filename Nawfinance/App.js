import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import i18n configuration
import './src/i18n';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import AppConfigScreen from './src/screens/AppConfigScreen';
import ApiConfigScreen from './src/screens/ApiConfigScreen';
import CompletionScreen from './src/screens/CompletionScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#4CAF50" />
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#4CAF50' }
        }}
      >
        {!isSetupComplete ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="AppConfig" component={AppConfigScreen} />
            <Stack.Screen name="ApiConfig" component={ApiConfigScreen} />
            <Stack.Screen 
              name="Completion" 
              component={CompletionScreen}
              initialParams={{ setIsSetupComplete, apiUrl, spreadsheetId }}
            />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
