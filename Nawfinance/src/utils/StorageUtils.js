import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  API_URL: 'wallet_app_api_url',
  APP_CONFIG: 'wallet_app_config',
  USER_PREFERENCES: 'wallet_app_preferences',
  IS_SETUP_COMPLETE: 'wallet_app_setup_complete',
  CACHED_TRANSACTIONS: 'wallet_app_cached_transactions',
  CACHED_ANALYTICS: 'wallet_app_cached_analytics',
  LAST_SYNC: 'wallet_app_last_sync',
};

class StorageUtils {
  // Save API URL
  static async saveApiUrl(url) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.API_URL, url);
    } catch (error) {
      console.error('Error saving API URL:', error);
      throw error;
    }
  }

  // Get API URL
  static async getApiUrl() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    } catch (error) {
      console.error('Error getting API URL:', error);
      return null;
    }
  }

  // Save app configuration
  static async saveAppConfig(config) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving app config:', error);
      throw error;
    }
  }

  // Get app configuration
  static async getAppConfig() {
    try {
      const config = await AsyncStorage.getItem(STORAGE_KEYS.APP_CONFIG);
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error('Error getting app config:', error);
      return null;
    }
  }

  // Save user preferences
  static async saveUserPreferences(preferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  // Get user preferences
  static async getUserPreferences() {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  // Set setup completion status
  static async setSetupComplete(isComplete) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_SETUP_COMPLETE, JSON.stringify(isComplete));
    } catch (error) {
      console.error('Error setting setup complete status:', error);
      throw error;
    }
  }

  // Check if setup is complete
  static async isSetupComplete() {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.IS_SETUP_COMPLETE);
      return status ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Error checking setup complete status:', error);
      return false;
    }
  }

  // Cache transactions
  static async cacheTransactions(transactions) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_TRANSACTIONS, JSON.stringify(transactions));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Error caching transactions:', error);
      throw error;
    }
  }

  // Get cached transactions
  static async getCachedTransactions() {
    try {
      const transactions = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_TRANSACTIONS);
      return transactions ? JSON.parse(transactions) : [];
    } catch (error) {
      console.error('Error getting cached transactions:', error);
      return [];
    }
  }

  // Cache analytics data
  static async cacheAnalytics(analytics) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_ANALYTICS, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error caching analytics:', error);
      throw error;
    }
  }

  // Get cached analytics
  static async getCachedAnalytics() {
    try {
      const analytics = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_ANALYTICS);
      return analytics ? JSON.parse(analytics) : null;
    } catch (error) {
      console.error('Error getting cached analytics:', error);
      return null;
    }
  }

  // Get last sync time
  static async getLastSyncTime() {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return lastSync ? new Date(lastSync) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  // Clear all app data (for reset functionality)
  static async clearAllData() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Clear only cache data
  static async clearCacheData() {
    try {
      const cacheKeys = [
        STORAGE_KEYS.CACHED_TRANSACTIONS,
        STORAGE_KEYS.CACHED_ANALYTICS,
        STORAGE_KEYS.LAST_SYNC,
      ];
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache data:', error);
      throw error;
    }
  }

  // Check if data is stale (older than specified minutes)
  static async isDataStale(maxAgeMinutes = 30) {
    try {
      const lastSync = await this.getLastSyncTime();
      if (!lastSync) return true;

      const now = new Date();
      const diffMinutes = (now - lastSync) / (1000 * 60);
      return diffMinutes > maxAgeMinutes;
    } catch (error) {
      console.error('Error checking if data is stale:', error);
      return true;
    }
  }

  // Get all stored data (for debugging)
  static async getAllStoredData() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      const data = {};
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        data[key] = value;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting all stored data:', error);
      return {};
    }
  }
}

export default StorageUtils;

