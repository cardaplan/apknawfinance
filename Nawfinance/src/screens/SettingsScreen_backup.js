import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [showResetModal, setShowResetModal] = useState(false);

  const handleOpenSettings = () => {
    // Navigate to detailed settings screen
    Alert.alert('Settings', 'This would open the detailed settings screen');
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App Configuration',
      'This will completely reset your app to its initial state and clear all stored data including:\n\n• All app settings and preferences\n• API endpoint configuration\n• Custom categories\n• App will restart with the welcome setup\n\nThis action cannot be undone. Are you sure you want to continue?',
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'RESET EVERYTHING',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'App has been reset successfully');
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      id: 1,
      title: 'Application Preferences',
      subtitle: 'Basic app configuration',
      icon: 'settings-outline',
      onPress: handleOpenSettings,
    },
    {
      id: 2,
      title: 'Admin Settings',
      subtitle: 'Administrative configuration',
      icon: 'shield-outline',
      onPress: handleOpenSettings,
    },
    {
      id: 3,
      title: 'Custom Categories',
      subtitle: 'Add your own transaction categories for both expenses and income',
      icon: 'list-outline',
      onPress: handleOpenSettings,
    },
    {
      id: 4,
      title: 'Need Help?',
      subtitle: 'Reference links for locale and currency codes',
      icon: 'help-circle-outline',
      onPress: handleOpenSettings,
    },
    {
      id: 5,
      title: 'Preview',
      subtitle: 'See how your settings will look',
      icon: 'eye-outline',
      onPress: handleOpenSettings,
    },
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
    >
      <View style={styles.settingContent}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="add-outline" size={20} color="#4CAF50" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>
          Customize your My Wallet experience with personalized settings
        </Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <View style={styles.quickActionItem}>
            <Text style={styles.quickActionText}>• Localization & Currency</Text>
          </View>
          <View style={styles.quickActionItem}>
            <Text style={styles.quickActionText}>• Custom Categories</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.openSettingsButton} onPress={handleOpenSettings}>
          <Text style={styles.openSettingsButtonText}>Open Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleResetApp}>
          <Text style={styles.resetButtonText}>Reset App Configuration</Text>
        </TouchableOpacity>

        <View style={styles.settingsList}>
          {settingsOptions.map(renderSettingItem)}
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.resetToDefaultsButton}>
            <Text style={styles.resetToDefaultsText}>Reset to Defaults</Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  quickActions: {
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
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionItem: {
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#666',
  },
  openSettingsButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  openSettingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#F44336',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsList: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomActions: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  resetToDefaultsButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  resetToDefaultsText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

