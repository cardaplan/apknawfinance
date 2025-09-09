import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StorageUtils } from '../utils/StorageUtils';
import googleSheetsService from '../services/GoogleSheetsService';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [appName, setAppName] = useState('My Wallet');
  const [currency, setCurrency] = useState('BRL');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { apiUrl, spreadsheetId } = route.params || {};

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (apiUrl && spreadsheetId) {
        googleSheetsService.setApiUrl(apiUrl);
        googleSheetsService.setSpreadsheetId(spreadsheetId);
        const isConnected = await googleSheetsService.testConnection();
        if (isConnected) {
          const summary = await googleSheetsService.getBalanceSummary();
          setBalance(summary.totalBalance || 0);

          const fetchedTransactions = await googleSheetsService.getTransactions();
          // Sort by date descending and take the latest 5
          const sortedTransactions = fetchedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
          setTransactions(sortedTransactions);
        } else {
          Alert.alert(t('common.error'), t('home.connectionError'));
        }
      } else {
        Alert.alert(t('common.error'), t('home.apiNotConfigured'));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert(t('common.error'), t('home.fetchDataError'));
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, spreadsheetId, t]);

  useEffect(() => {
    loadAppConfig();
    setShowWelcome(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const loadAppConfig = async () => {
    try {
      const config = await StorageUtils.getAppConfig();
      if (config && config.appName) {
        setAppName(config.appName);
      }
    } catch (error) {
      console.error('Error loading app config:', error);
    }
  };

  const loadAppConfig = async () => {
    try {
      const config = await StorageUtils.getAppConfig();
      if (config && config.appName) {
        setAppName(config.appName);
        setCurrency(config.currency || 'BRL');
      }
    } catch (error) {
      console.error('Error loading app config:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(Math.abs(amount));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Bills & Utilities': '#FF5722',
      'Personal Care': '#E91E63',
      'Education': '#3F51B5',
      'Investment Income': '#4CAF50',
    };
    return colors[category] || '#757575';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>💰 {t('home.title', { appName })}</Text>
        </View>

        {/* Welcome Modal */}
        <Modal
          visible={showWelcome}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.welcomeModal}>
              <Text style={styles.welcomeTitle}>🎉 {t('home.welcome')}</Text>
              <Text style={styles.welcomeDescription}>
                {t('home.welcomeDescription')}
              </Text>
              <TouchableOpacity
                style={styles.gotItButton}
                onPress={() => setShowWelcome(false)}
              >
                <Text style={styles.gotItButtonText}>{t('home.gotIt')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Loading Indicator */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>{t("common.loadingData")}</Text>
          </View>
        ) : (
          <>
            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>{t("home.totalBalance")}</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.incomeButton]}
              onPress={() => navigation.navigate('AddTransaction', { type: 'Income' })}
            >
              <Text style={styles.actionButtonText}>+ {t('home.addIncome')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.expenseButton]}
              onPress={() => navigation.navigate('AddTransaction', { type: 'Expense' })}
            >
              <Text style={styles.actionButtonText}>- {t('home.addExpense')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.recentTransactions')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionList')}>
              <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.categoryDot,
                    { backgroundColor: getCategoryColor(transaction.category) }
                  ]} />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionCategory}>
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                </View>
                
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'Income' ? styles.incomeAmount : styles.expenseAmount
                ]}>
                  {transaction.type === 'Income' ? '+' : ''}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noTransactionsText}>{t('home.noRecentTransactions')}</Text>
          )}
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
    paddingBottom: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  gotItButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  gotItButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  incomeButton: {
    backgroundColor: '#4CAF50',
  },
  expenseButton: {
    backgroundColor: '#FF5722',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsSection: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  expenseAmount: {
    color: '#FF5722',
  },
});



  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  noTransactionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },

