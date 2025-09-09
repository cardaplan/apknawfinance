import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function OnboardingScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stepText}>{t('onboarding.step', { current: 1, total: 4 })}</Text>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.title}>{t('onboarding.welcome')} 👋</Text>
          <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
            </View>
          </View>
          
          <View style={styles.iconContainer}>
            <Text style={styles.icons}>🎯📊💰⚙️</Text>
          </View>
          
          <Text style={styles.description}>
            {t('onboarding.description')}
          </Text>
          
          <View style={styles.featureList}>
            <Text style={styles.feature}>🎯 {t('onboarding.features.track')}</Text>
            <Text style={styles.feature}>📊 {t('onboarding.features.analytics')}</Text>
            <Text style={styles.feature}>💰 {t('onboarding.features.sync')}</Text>
            <Text style={styles.feature}>⚙️ {t('onboarding.features.customize')}</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => navigation.navigate('AppConfig')}
          >
            <Text style={styles.nextButtonText}>{t('onboarding.next')}</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
  },
  progressContainer: {
    marginBottom: 40,
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
    marginBottom: 30,
  },
  icons: {
    fontSize: 48,
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
  featureList: {
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 16,
    color: 'white',
    marginBottom: 12,
    textAlign: 'left',
    opacity: 0.9,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  nextButton: {
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

