import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function AppConfigScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [appName, setAppName] = useState('My Wallet');
  const [selectedCurrency, setSelectedCurrency] = useState('BRL');
  const [selectedLocale, setSelectedLocale] = useState('pt-BR');

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
    { code: 'BRL', symbol: 'R$' },
  ];

  const locales = {
    'USD': ['en-US'],
    'EUR': ['en-US', 'pt-BR', 'es-ES', 'fr-FR'],
    'GBP': ['en-US'],
    'JPY': ['ja-JP'],
    'BRL': ['pt-BR'],
  };

  const getAvailableLocales = () => {
    return locales[selectedCurrency] || ['en-US'];
  };

  const handleNext = () => {
    // Change language based on selected locale
    const language = selectedLocale.split('-')[0];
    i18n.changeLanguage(language);
    
    navigation.navigate('ApiConfig', {
      appName,
      currency: selectedCurrency,
      locale: selectedLocale,
    });
  };

  const isNextEnabled = appName.trim() && selectedCurrency && selectedLocale;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.stepText}>{t('onboarding.step', { current: 2, total: 4 })}</Text>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.title}>{t('appConfig.title')}</Text>
          <Text style={styles.subtitle}>{t('appConfig.subtitle')}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
            </View>
          </View>
          
          <Text style={styles.description}>
            {t('appConfig.description')}
          </Text>
          
          <View style={styles.formSection}>
            <Text style={styles.label}>{t('appConfig.appName')}</Text>
            <TextInput
              style={styles.textInput}
              value={appName}
              onChangeText={setAppName}
              placeholder="My Wallet App"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.label}>{t('appConfig.currency')}</Text>
            <View style={styles.optionGrid}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.optionButton,
                    selectedCurrency === currency.code && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency.code);
                    // Reset locale when currency changes
                    const availableLocales = locales[currency.code] || ['en-US'];
                    setSelectedLocale(availableLocales[0]);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    selectedCurrency === currency.code && styles.selectedOptionText,
                  ]}>
                    {t(`currencies.${currency.code}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.label}>{t('appConfig.locale')}</Text>
            <Text style={styles.localeDescription}>
              {t('appConfig.localeDescription')}
            </Text>
            <View style={styles.optionGrid}>
              {getAvailableLocales().map((locale) => (
                <TouchableOpacity
                  key={locale}
                  style={[
                    styles.optionButton,
                    selectedLocale === locale && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedLocale(locale)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedLocale === locale && styles.selectedOptionText,
                  ]}>
                    {t(`locales.${locale}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <Text style={styles.formatDescription}>
            {t('appConfig.formatDescription')}
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.previousButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.previousButtonText}>{t('onboarding.previous')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.nextButton, !isNextEnabled && styles.disabledButton]} 
          onPress={handleNext}
          disabled={!isNextEnabled}
        >
          <Text style={[styles.nextButtonText, !isNextEnabled && styles.disabledButtonText]}>
            {t('onboarding.next')}
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
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  stepText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
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
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.9,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
  },
  progressSegment: {
    width: 50,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  activeSegment: {
    backgroundColor: 'white',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    opacity: 0.9,
  },
  formSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
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
  optionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#4CAF50',
  },
  localeDescription: {
    fontSize: 14,
    color: 'white',
    marginBottom: 12,
    opacity: 0.8,
  },
  formatDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    opacity: 0.8,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  disabledButtonText: {
    color: 'rgba(76, 175, 80, 0.5)',
  },
});

