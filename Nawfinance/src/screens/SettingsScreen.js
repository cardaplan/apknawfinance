import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StorageUtils } from '../utils/StorageUtils';

export default function SettingsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [appConfig, setAppConfig] = useState({
    appName: 'My Wallet',
    currency: 'BRL',
    locale: 'pt-BR'
  });

  useEffect(() => {
    loadAppConfig();
  }, []);

  const loadAppConfig = async () => {
    try {
      const config = await StorageUtils.getAppConfig();
      if (config) {
        setAppConfig(config);
      }
    } catch (error) {
      console.error('Error loading app config:', error);
    }
  };

  const handleResetConfig = () => {
    Alert.alert(
      t('settings.resetAppConfig'),
      'Tem certeza de que deseja redefinir todas as configurações?',
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageUtils.clearAll();
              Alert.alert(
                t('common.success'),
                'Configurações redefinidas com sucesso!'
              );
            } catch (error) {
              Alert.alert(t('common.error'), 'Erro ao redefinir configurações');
            }
          },
        },
      ]
    );
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const settingsOptions = [
    {
      id: 'preferences',
      title: t('settings.applicationPreferences'),
      description: t('settings.applicationPreferencesDescription'),
      icon: '⚙️',
      onPress: () => {
        Alert.alert(
          'Preferências do Aplicativo',
          'Esta funcionalidade permite configurar preferências básicas do aplicativo como tema, notificações e outras configurações gerais.',
          [
            { text: 'OK' }
          ]
        );
      }
    },
    {
      id: 'categories',
      title: t('settings.customCategoriesTitle'),
      description: t('settings.customCategoriesDescription'),
      icon: '📝',
      onPress: () => {
        Alert.alert(
          'Categorias Personalizadas',
          'Aqui você pode adicionar, editar ou remover categorias personalizadas para suas transações de receita e despesa.',
          [
            { text: 'OK' }
          ]
        );
      }
    },
    {
      id: 'help',
      title: t('settings.needHelp'),
      description: t('settings.needHelpDescription'),
      icon: '❓',
      onPress: () => {
        Alert.alert(
          'Precisa de Ajuda?',
          'Links úteis:\n\n• Manual do usuário\n• Códigos de localização e moeda\n• Suporte técnico\n• FAQ - Perguntas frequentes',
          [
            { text: 'OK' }
          ]
        );
      }
    },
    {
      id: 'preview',
      title: t('settings.preview'),
      description: t('settings.previewDescription'),
      icon: '👁️',
      onPress: () => {
        Alert.alert(
          'Visualizar Configurações',
          `Configurações atuais:\n\n📱 App: ${appConfig.appName}\n💰 Moeda: ${appConfig.currency}\n🌍 Localização: ${appConfig.locale}\n🗣️ Idioma: ${i18n.language === 'pt' ? 'Português (BR)' : 'English (US)'}`,
          [
            { text: 'OK' }
          ]
        );
      }
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ {t('settings.title')}</Text>
          <Text style={styles.subtitle}>
            {t('settings.subtitle', { appName: appConfig.appName })}
          </Text>
        </View>

        {/* Current Configuration */}
        <View style={styles.configCard}>
          <Text style={styles.cardTitle}>Configuração Atual</Text>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>📱 {t('appConfig.appName')}</Text>
            <Text style={styles.configValue}>{appConfig.appName}</Text>
          </View>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>💰 {t('appConfig.currency')}</Text>
            <Text style={styles.configValue}>{appConfig.currency}</Text>
          </View>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>🌍 {t('appConfig.locale')}</Text>
            <Text style={styles.configValue}>{appConfig.locale}</Text>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.languageCard}>
          <Text style={styles.cardTitle}>Idioma / Language</Text>
          
          <TouchableOpacity
            style={[
              styles.languageOption,
              i18n.language === 'pt' && styles.selectedLanguage
            ]}
            onPress={() => changeLanguage('pt')}
          >
            <Text style={styles.languageText}>🇧🇷 Português (Brasil)</Text>
            {i18n.language === 'pt' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.languageOption,
              i18n.language === 'en' && styles.selectedLanguage
            ]}
            onPress={() => changeLanguage('en')}
          >
            <Text style={styles.languageText}>🇺🇸 English (United States)</Text>
            {i18n.language === 'en' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.optionsCard}>
          <Text style={styles.cardTitle}>Opções</Text>
          
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Admin Settings */}
        <View style={styles.adminCard}>
          <Text style={styles.cardTitle}>{t('settings.adminSettings')}</Text>
          <Text style={styles.adminDescription}>
            {t('settings.adminSettingsDescription')}
          </Text>
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetConfig}
          >
            <Text style={styles.resetButtonText}>
              🔄 {t('settings.resetToDefaults')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>My Wallet App v1.0.0</Text>
          <Text style={styles.infoText}>Desenvolvido com React Native</Text>
          <Text style={styles.infoText}>Integração com Google Sheets</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    lineHeight: 22,
  },
  configCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  configLabel: {
    fontSize: 16,
    color: '#333',
  },
  configValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  languageCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedLanguage: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  optionsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  adminCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
});

