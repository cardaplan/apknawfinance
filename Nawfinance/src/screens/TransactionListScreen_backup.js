import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    dateRange: '',
    startDate: '',
    endDate: '',
  });

  // Sample transaction data
  const allTransactions = [
    {
      id: '1',
      description: 'Healthcare',
      amount: -48.00,
      category: 'Transportation',
      date: 'Jul 22',
      type: 'expense'
    },
    {
      id: '2',
      description: 'Train tickets',
      amount: -48.00,
      category: 'Transportation',
      date: 'Jul 22',
      type: 'expense'
    },
    {
      id: '3',
      description: 'Movie tickets',
      amount: -30.00,
      category: 'Entertainment',
      date: 'Jul 21',
      type: 'expense'
    },
    {
      id: '4',
      description: 'Freelance payment',
      amount: 650.00,
      category: 'Freelance/Contract Work',
      date: 'Jul 20',
      type: 'income'
    },
    {
      id: '5',
      description: 'Property tax',
      amount: -309.00,
      category: 'Bills & Utilities',
      date: 'Jul 19',
      type: 'expense'
    },
    {
      id: '6',
      description: 'Gym membership',
      amount: -45.00,
      category: 'Personal Care',
      date: 'Jul 18',
      type: 'expense'
    },
    {
      id: '7',
      description: 'Gas bill',
      amount: -55.00,
      category: 'Bills & Utilities',
      date: 'Jul 17',
      type: 'expense'
    },
    {
      id: '8',
      description: 'Online game purchase',
      amount: -20.00,
      category: 'Entertainment',
      date: 'Jul 16',
      type: 'expense'
    },
    {
      id: '9',
      description: 'Gift received',
      amount: 100.00,
      category: 'Gifts/Grants',
      date: 'Jul 15',
      type: 'income'
    }
  ];

  const [transactions, setTransactions] = useState(allTransactions);

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return amount >= 0 ? `+¥${formatted}` : `-¥${formatted}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Transportation': '#2196F3',
      'Entertainment': '#E91E63',
      'Freelance/Contract Work': '#4CAF50',
      'Bills & Utilities': '#FF5722',
      'Personal Care': '#9C27B0',
      'Gifts/Grants': '#FF9800',
    };
    return colors[category] || '#9E9E9E';
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setTransactions(allTransactions);
    } else {
      const filtered = allTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(query.toLowerCase()) ||
        transaction.category.toLowerCase().includes(query.toLowerCase())
      );
      setTransactions(filtered);
    }
  };

  const applyFilters = () => {
    let filtered = allTransactions;

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Add date range filtering logic here if needed

    setTransactions(filtered);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      dateRange: '',
      startDate: '',
      endDate: '',
    });
    setTransactions(allTransactions);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <View style={styles.transactionMeta}>
          <View style={[
            styles.categoryTag,
            { backgroundColor: getCategoryColor(item.category) }
          ]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.transactionActions}>
        <Text style={[
          styles.transactionAmount,
          { color: item.type === 'income' ? '#4CAF50' : '#F44336' }
        ]}>
          {formatAmount(item.amount)}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trash-outline" size={16} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter Transactions</Text>
          <TouchableOpacity onPress={() => setShowFilterModal(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filters.type === 'expense' && styles.selectedFilterOption
                ]}
                onPress={() => setFilters({...filters, type: 'expense'})}
              >
                <Text style={[
                  styles.filterOptionText,
                  filters.type === 'expense' && styles.selectedFilterOptionText
                ]}>
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filters.type === 'income' && styles.selectedFilterOption
                ]}
                onPress={() => setFilters({...filters, type: 'income'})}
              >
                <Text style={[
                  styles.filterOptionText,
                  filters.type === 'income' && styles.selectedFilterOptionText
                ]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.filterOptions}>
              {['Food & Dining', 'Transportation', 'Shopping'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    filters.category === category && styles.selectedFilterOption
                  ]}
                  onPress={() => setFilters({...filters, category})}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.category === category && styles.selectedFilterOptionText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Date Range</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="Start Date (YYYY-MM-DD)"
              value={filters.startDate}
              onChangeText={(text) => setFilters({...filters, startDate: text})}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="End Date (YYYY-MM-DD)"
              value={filters.endDate}
              onChangeText={(text) => setFilters({...filters, endDate: text})}
            />
            
            <View style={styles.quickDateOptions}>
              <TouchableOpacity style={styles.quickDateOption}>
                <Text style={styles.quickDateText}>This Month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickDateOption}>
                <Text style={styles.quickDateText}>Last Month</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Items</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Ionicons name="filter" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.transactionsList}
        />
      </View>

      <FilterModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 4,
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionActions: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedFilterOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedFilterOptionText: {
    color: 'white',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  quickDateOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  quickDateOption: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickDateText: {
    fontSize: 14,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

