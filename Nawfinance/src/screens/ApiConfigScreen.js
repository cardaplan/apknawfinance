import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import googleSheetsService from '../services/GoogleSheetsService';

export default function ApiConfigScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { appName, currency, locale } = route.params || {};
  const [apiUrl, setApiUrl] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    if (!apiUrl.trim() || !spreadsheetId.trim()) {
      Alert.alert(t("common.error"), "Please enter both API URL and Spreadsheet ID");
      return;
    }

    setIsLoading(true);
    try {
      googleSheetsService.setApiUrl(apiUrl);
      googleSheetsService.setSpreadsheetId(spreadsheetId);
      const connected = await googleSheetsService.testConnection();
      setIsConnected(connected);
      if (!connected) {
        Alert.alert(t("common.error"), "Connection failed. Please check your URL and Spreadsheet ID.");
      }
    } catch (error) {
      Alert.alert(t("common.error"), `Connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    navigation.navigate("Completion", {
      appName,
      currency,
      locale,
      apiUrl,
      spreadsheetId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.stepText}>{t('onboarding.step', { current: 3, total: 4 })}</Text>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.title}>{t('apiConfig.title')}</Text>
          <Text style={styles.subtitle}>{t('apiConfig.subtitle')}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
            </View>
          </View>
          
          <Text style={styles.description}>
            {t('apiConfig.description')}
          </Text>
          
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>📋 {t('apiConfig.howToTitle')}</Text>
            <Text style={styles.instructionStep}>1. {t('apiConfig.howToSteps.deploy')}</Text>
            <Text style={styles.instructionStep}>2. {t('apiConfig.howToSteps.copy')}</Text>
            <Text style={styles.instructionStep}>3. {t('apiConfig.howToSteps.paste')}</Text>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.label}>{t("apiConfig.urlLabel")}</Text>
            <TextInput
              style={styles.textInput}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder={t("apiConfig.urlPlaceholder")}
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>{t("apiConfig.spreadsheetIdLabel")}</Text>
            <TextInput
              style={styles.textInput}
              value={spreadsheetId}
              onChangeText={setSpreadsheetId}
              placeholder={t("apiConfig.spreadsheetIdPlaceholder")}
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.testButton, isLoading && styles.disabledButton]} 
            onPress={testConnection}
            disabled={isLoading || !apiUrl.trim()}
          >
            <Text style={styles.testButtonText}>
              {isLoading ? t('common.loading') : t('apiConfig.testConnection')}
            </Text>
          </TouchableOpacity>
          
          {isConnected && (
            <View style={styles.connectedBox}>
              <Text style={styles.connectedText}>✓ {t('apiConfig.connected')}</Text>
            </View>
          )}
          
          <Text style={styles.securityNote}>
            🔒 {t('apiConfig.securityNote')}
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
          style={[styles.nextButton, !isConnected && styles.disabledButton]} 
          onPress={handleNext}
          disabled={!isConnected}
        >
          <Text style={[styles.nextButtonText, !isConnected && styles.disabledButtonText]}>
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
    marginBottom: 25,
    lineHeight: 24,
    opacity: 0.9,
  },
  instructionsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  instructionStep: {
    fontSize: 14,
    color: 'white',
    marginBottom: 6,
    opacity: 0.9,
  },
  formSection: {
    marginBottom: 20,
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
    fontSize: 14,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  testButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectedBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  connectedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityNote: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
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

