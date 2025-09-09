import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function CompletionScreen({ navigation, route }) {
  const { setIsSetupComplete } = route.params;

  const handleGetStarted = () => {
    setIsSetupComplete(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 4 of 4</Text>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.title}>All Set! 🎉</Text>
          <Text style={styles.subtitle}>Your app is ready to use</Text>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={[styles.progressSegment, styles.activeSegment]} />
          </View>
          
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎯🎉</Text>
          </View>
          
          <Text style={styles.title2}>Congratulations!</Text>
          
          <Text style={styles.description}>
            Your wallet app is now configured and ready to use. You can always change these settings later.
          </Text>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Configuration Summary:</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>📱</Text>
              <Text style={styles.summaryText}>App Name: My Wallet</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>💰</Text>
              <Text style={styles.summaryText}>Currency: JPY (¥)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>🌍</Text>
              <Text style={styles.summaryText}>Locale: Japanese (Japan)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>✅</Text>
              <Text style={styles.summaryText}>API: ✓ Connected</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.previousButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
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
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
  },
  summaryText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  getStartedButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});

