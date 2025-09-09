import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';

export default function AppConfigScreen({ navigation }) {
  const [appName, setAppName] = useState('My Wallet App');
  const [currency, setCurrency] = useState('');
  const [locale, setLocale] = useState('');

  const currencies = ['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'BRL (R$)'];
  const locales = ['English (US)', 'Portuguese (BR)', 'Spanish (ES)', 'French (FR)', 'Japanese (JP)'];

  const handleNext = () => {
    if (currency && locale) {
      navigation.navigate('ApiConfig');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 2 of 4</Text>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.title}>App Configuration</Text>
          <Text style={styles.subtitle}>Customize your app name and currency settings</Text>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={styles.progressSegment} />
            <View style={styles.progressSegment} />
          </View>
          
          <Text style={styles.description}>
            Give your app a personal touch by customizing its name and selecting your preferred currency and locale.
          </Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>App Name</Text>
              <TextInput
                style={styles.input}
                value={appName}
                onChangeText={setAppName}
                placeholder="My Wallet App"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Currency</Text>
              <View style={styles.optionsContainer}>
                {currencies.map((curr, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.option,
                      currency === curr && styles.selectedOption
                    ]}
                    onPress={() => setCurrency(curr)}
                  >
                    <Text style={[
                      styles.optionText,
                      currency === curr && styles.selectedOptionText
                    ]}>
                      {curr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Locale</Text>
              <Text style={styles.helperText}>Choose a currency first to see available locales</Text>
              <View style={styles.optionsContainer}>
                {locales.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.option,
                      locale === loc && styles.selectedOption,
                      !currency && styles.disabledOption
                    ]}
                    onPress={() => currency && setLocale(loc)}
                    disabled={!currency}
                  >
                    <Text style={[
                      styles.optionText,
                      locale === loc && styles.selectedOptionText,
                      !currency && styles.disabledOptionText
                    ]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <Text style={styles.footerText}>
              Your currency and locale determine how amounts are displayed and formatted throughout the app.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.previousButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.previousButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!currency || !locale) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!currency || !locale}
        >
          <Text style={[
            styles.nextButtonText,
            (!currency || !locale) && styles.disabledButtonText
          ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
    textAlign: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressSegment: {
    height: 4,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeSegment: {
    backgroundColor: 'white',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  helperText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedOption: {
    backgroundColor: 'white',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#4CAF50',
  },
  disabledOptionText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 12,
  },
  previousButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  previousButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  disabledButtonText: {
    color: 'rgba(76, 175, 80, 0.5)',
  },
});

