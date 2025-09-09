import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import googleSheetsService from '../services/GoogleSheetsService';
import { useFocusEffect } from '@react-navigation/native';

export default function TransactionListScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { apiUrl, spreadsheetId } = route.params || {};

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      if (apiUrl && spreadsheetId) {
        googleSheetsService.setApiUrl(apiUrl);
        googleSheetsService.setSpreadsheetId(spreadsheetId);
        const isConnected = await googleSheetsService.testConnection();
        if (isConnected) {
          const fetchedTransactions = await googleSheetsService.getTransactions();
          // Sort by date descending
          const sortedTransactions = fetchedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
          setTransactions(sortedTransactions);
        } else {
          Alert.alert(t('common.error'), t('transactionList.connectionError'));
        }
      } else {
        Alert.alert(t('common.error'), t('transactionList.apiNotConfigured'));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert(t('common.error'), t('transactionList.fetchDataError'));
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, spreadsheetId, t]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [fetchTransactions])
  );

  const filterOptions = [
    { key: 'all', label: t('transactionList.all') },
    { key: 'income', label: t('transactionList.income') },
    { key: 'expense', label: t('transactionList.expense') }
  ];

  const getFilteredTransactions = () => {
    if (selectedFilter === 'all') return transactions;
    return transactions.filter(transaction => 
      transaction.type.toLowerCase() === selectedFilter
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Contas e Utilidades': '#FF5722',
      'Cuidados Pessoais': '#E91E63',
      'Educação': '#3F51B5',
      'Renda de Investimento': '#4CAF50',
      'Salário': '#4CAF50',
      'Freelance/Trabalho por Contrato': '#4CAF50',
      'Alimentação': '#FF9800',
    };
    return colors[category] || '#757575';
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.categoryDot,
          { backgroundColor: getCategoryColor(item.category) }
        ]} />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>
            {item.description}
          </Text>
          <Text style={styles.transactionCategory}>
            {item.category} • {formatDate(item.date)}
          </Text>
        </View>
      </View>
      
      <Text style={[
        styles.transactionAmount,
        item.type === 'Income' ? styles.incomeAmount : styles.expenseAmount
      ]}>
        {item.type === 'Income' ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </View>
  );

  const filteredTransactions = getFilteredTransactions();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('transactionList.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>{t('transactionList.filter')}:</Text>
        <View style={styles.filterTabs}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterTab,
                selectedFilter === option.key && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(option.key)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === option.key && styles.activeFilterTabText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>{t('common.loadingData')}</Text>
          </View>
        ) : filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {t('transactionList.noTransactions')}
            </Text>
            <Text style={styles.emptyStateDescription}>
              {t('transactionList.addFirst')}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Text style={styles.addButtonText}>
                + Adicionar Transação
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total {t('transactionList.income')}</Text>
          <Text style={[styles.summaryAmount, styles.incomeAmount]}>
            {formatCurrency(
              filteredTransactions
                .filter(t => t.type === 'Income')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total {t('transactionList.expense')}</Text>
          <Text style={[styles.summaryAmount, styles.expenseAmount]}>
            {formatCurrency(
              filteredTransactions
                .filter(t => t.type === 'Expense')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
            )}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilterTab: {
    backgroundColor: '#4CAF50',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterTabText: {
    color: 'white',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#666',
  },

