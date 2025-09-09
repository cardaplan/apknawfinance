import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function CompletionScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { setIsSetupComplete, apiUrl, spreadsheetId } = route.params || {};
  const { appName, currency, locale } = route.params || {};

  const handleGetStarted = () => {
    if (setIsSetupComplete) {
      setIsSetupComplete(true);
      navigation.navigate("Main", { apiUrl, spreadsheetId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stepText}>{t('onboarding.step', { current: 4, total: 4 })}</Text>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.title}>{t('completion.title')} 🎉</Text>
          <Text style={styles.subtitle}>{t('completion.subtitle')}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
            </View>
          </View>
          
          <View style={styles.iconContainer}>
            <Text style={styles.icons}>🎯🎉</Text>
          </View>
          
          <Text style={styles.congratulations}>{t('completion.congratulations')}</Text>
          
          <Text style={styles.description}>
            {t('completion.description')}
          </Text>
          
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>{t('completion.summaryTitle')}</Text>
            <Text style={styles.summaryItem}>📱 {t('completion.appName', { name: appName || 'My Wallet' })}</Text>
            <Text style={styles.summaryItem}>💰 {t('completion.currency', { currency: currency || 'BRL (R$)' })}</Text>
            <Text style={styles.summaryItem}>🌍 {t('completion.locale', { locale: locale || 'Portuguese (BR)' })}</Text>
            <Text style={styles.summaryItem}>🔗 {t('completion.api')}</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.getStartedButton} 
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedButtonText}>{t('onboarding.getStarted')}</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 20,
    alignItems: 'center',
  },
  stepText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.9,
  },
  progressContainer: {
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
  iconContainer: {
    marginBottom: 20,
  },
  icons: {
    fontSize: 48,
    textAlign: 'center',
  },
  congratulations: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    opacity: 0.9,
  },
  summaryBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryItem: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
    opacity: 0.9,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  getStartedButton: {
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
  getStartedButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

