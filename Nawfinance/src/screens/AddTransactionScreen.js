import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import googleSheetsService from '../services/GoogleSheetsService';

export default function AddTransactionScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { type = 'Expense' } = route.params || {};
  
  // Format date as DD-MM-YYYY
  const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Convert DD-MM-YYYY back to YYYY-MM-DD for processing
  const convertToISODate = (ddmmyyyy) => {
    if (!ddmmyyyy || ddmmyyyy.length !== 10) return new Date().toISOString().split('T')[0];
    const [day, month, year] = ddmmyyyy.split('-');
    return `${year}-${month}-${day}`;
  };
  
  const [formData, setFormData] = useState({
    date: formatDateToDDMMYYYY(new Date()),
    description: '',
    amount: '',
    type: type,
    category: '',
    remarks: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const incomeCategories = [
    { key: 'salary', label: t('addTransaction.incomeCategories.salary') },
    { key: 'freelance', label: t('addTransaction.incomeCategories.freelance') },
    { key: 'rental', label: t('addTransaction.incomeCategories.rental') },
    { key: 'investment', label: t('addTransaction.incomeCategories.investment') },
    { key: 'gifts', label: t('addTransaction.incomeCategories.gifts') },
    { key: 'refunds', label: t('addTransaction.incomeCategories.refunds') },
    { key: 'other', label: t('addTransaction.incomeCategories.other') }
  ];

  const expenseCategories = [
    { key: 'billsUtilities', label: t('addTransaction.expenseCategories.billsUtilities') },
    { key: 'entertainment', label: t('addTransaction.expenseCategories.entertainment') },
    { key: 'education', label: t('addTransaction.expenseCategories.education') },
    { key: 'foodDining', label: t('addTransaction.expenseCategories.foodDining') },
    { key: 'healthcare', label: t('addTransaction.expenseCategories.healthcare') },
    { key: 'shopping', label: t('addTransaction.expenseCategories.shopping') },
    { key: 'transport', label: t('addTransaction.expenseCategories.transport') },
    { key: 'personalCare', label: t('addTransaction.expenseCategories.personalCare') },
    { key: 'other', label: t('addTransaction.expenseCategories.other') }
  ];

  const getCurrentCategories = () => {
    return formData.type === 'Income' ? incomeCategories : expenseCategories;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: '' // Reset category when type changes
    }));
  };

  const handleSave = async () => {
    if (!formData.description.trim()) {
      Alert.alert(t('common.error'), 'Por favor, insira uma descrição');
      return;
    }
    
    if (!formData.amount.trim()) {
      Alert.alert(t('common.error'), 'Por favor, insira um valor');
      return;
    }
    
    if (!formData.category) {
      Alert.alert(t('common.error'), 'Por favor, selecione uma categoria');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare transaction data for Google Sheets
      const transactionData = {
        date: convertToISODate(formData.date), // Convert back to ISO format for backend
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        remarks: formData.remarks.trim()
      };

      // Save to Google Sheets
      await googleSheetsService.addTransaction(transactionData);

      Alert.alert(
        t('common.success'),
        'Transação salva com sucesso!',
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert(
        t('common.error'),
        'Erro ao salvar transação. Verifique sua conexão com o Google Sheets.',
        [
          {
            text: t('common.ok')
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.description.trim() && formData.amount.trim() && formData.category;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>{t('addTransaction.cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('addTransaction.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>{t('addTransaction.date')}</Text>
          <TextInput
            style={styles.textInput}
            value={formData.date}
            onChangeText={(value) => handleInputChange('date', value)}
            placeholder={t('addTransaction.placeholders.date')}
            placeholderTextColor="#999"
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>{t('addTransaction.description')}</Text>
          <TextInput
            style={styles.textInput}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder={t('addTransaction.placeholders.description')}
            placeholderTextColor="#999"
          />
        </View>

        {/* Amount Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>{t('addTransaction.amount')}</Text>
          <TextInput
            style={styles.textInput}
            value={formData.amount}
            onChangeText={(value) => handleInputChange('amount', value)}
            placeholder={t('addTransaction.placeholders.amount')}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Type Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>{t('addTransaction.type')}</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'Income' && styles.selectedIncomeType
              ]}
              onPress={() => handleTypeChange('Income')}
            >
              <Text style={[
                styles.typeButtonText,
                formData.type === 'Income' && styles.selectedTypeText
              ]}>
                {t('transactionList.income')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'Expense' && styles.selectedExpenseType
              ]}
              onPress={() => handleTypeChange('Expense')}
            >
              <Text style={[
                styles.typeButtonText,
                formData.type === 'Expense' && styles.selectedTypeText
              ]}>
                {t('transactionList.expense')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>{t('addTransaction.category')}</Text>
          <View style={styles.categoryGrid}>
            {getCurrentCategories().map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  formData.category === category.key && styles.selectedCategory
                ]}
                onPress={() => handleInputChange('category', category.key)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  formData.category === category.key && styles.selectedCategoryText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Remarks Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>{t('addTransaction.remarks')}</Text>
          <TextInput
            style={[styles.textInput, styles.remarksInput]}
            value={formData.remarks}
            onChangeText={(value) => handleInputChange('remarks', value)}
            placeholder={t('addTransaction.placeholders.remarks')}
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, (!isFormValid || isLoading) && styles.disabledButton]}
          onPress={handleSave}
          disabled={!isFormValid || isLoading}
        >
          <Text style={[styles.saveButtonText, (!isFormValid || isLoading) && styles.disabledButtonText]}>
            {isLoading ? 'Salvando...' : t('addTransaction.saveTransaction')}
          </Text>
        </TouchableOpacity>
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
  cancelButton: {
    fontSize: 16,
    color: '#FF5722',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  remarksInput: {
    height: 80,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedIncomeType: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  selectedExpenseType: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedTypeText: {
    color: 'white',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#999',
  },
});

