import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 1 of 4</Text>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.title}>Welcome! 👋</Text>
          <Text style={styles.subtitle}>Let's set up your wallet app</Text>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={styles.progressSegment} />
            <View style={styles.progressSegment} />
            <View style={styles.progressSegment} />
          </View>
          
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎯📊💰⚙️</Text>
          </View>
          
          <Text style={styles.description}>
            Welcome to your new wallet app! This quick setup will help you get started.
          </Text>
          
          <View style={styles.featureList}>
            <Text style={styles.feature}>🎯 Track income and expenses</Text>
            <Text style={styles.feature}>📊 View analytics and charts</Text>
            <Text style={styles.feature}>☁️ Sync with Google Sheets</Text>
            <Text style={styles.feature}>⚙️ Customize settings</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => navigation.navigate('AppConfig')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    marginBottom: 40,
  },
  stepText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 40,
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
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    fontSize: 48,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  featureList: {
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
});

