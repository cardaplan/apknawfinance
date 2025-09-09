import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { PieChart, BarChart } from 'react-native-chart-kit';
import googleSheetsService from '../services/GoogleSheetsService';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen({ route }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [monthlyData, setMonthlyData] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });

  const { apiUrl, spreadsheetId } = route.params || {};

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (apiUrl && spreadsheetId) {
        googleSheetsService.setApiUrl(apiUrl);
        googleSheetsService.setSpreadsheetId(spreadsheetId);
        const isConnected = await googleSheetsService.testConnection();
        if (isConnected) {
          const analytics = await googleSheetsService.getAnalytics('monthly');
          setAnalyticsData(analytics);
          
          const summary = await googleSheetsService.getBalanceSummary();
          setMonthlyData({
            income: summary.totalIncome || 0,
            expenses: summary.totalExpenses || 0,
            balance: summary.totalBalance || 0
          });
        } else {
          Alert.alert(t('common.error'), t('analytics.connectionError'));
        }
      } else {
        Alert.alert(t('common.error'), t('analytics.apiNotConfigured'));
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      Alert.alert(t('common.error'), t('analytics.fetchDataError'));
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, spreadsheetId, t]);

  useFocusEffect(
    useCallback(() => {
      fetchAnalyticsData();
    }, [fetchAnalyticsData])
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const pieData = [
    {
      name: t('analytics.categories.billsUtilities'),
      population: 35,
      color: '#FF5722',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: t('analytics.categories.entertainment'),
      population: 25,
      color: '#9C27B0',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: t('analytics.categories.education'),
      population: 20,
      color: '#3F51B5',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: t('analytics.categories.foodDining'),
      population: 15,
      color: '#FF9800',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: t('analytics.categories.healthcare'),
      population: 5,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  const barData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [4200, 4800, 3900, 5200, 4600, 5200],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [3200, 3600, 2900, 3840, 3400, 3840],
        color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: [t('analytics.income'), t('analytics.expenses')]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 {t('analytics.title')}</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>{t('common.loadingData')}</Text>
          </View>
        ) : (
          <>
            {/* Monthly Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.cardTitle}>{t('analytics.thisMonth')}</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('analytics.income')}</Text>
              <Text style={[styles.summaryAmount, styles.incomeText]}>
                {formatCurrency(monthlyData.income)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('analytics.expenses')}</Text>
              <Text style={[styles.summaryAmount, styles.expenseText]}>
                {formatCurrency(monthlyData.expenses)}
              </Text>
            </View>
          </View>
          
          <View style={styles.balanceRow}>
            <Text style={styles.summaryLabel}>{t('analytics.balance')}</Text>
            <Text style={[styles.summaryAmount, styles.balanceText]}>
              {formatCurrency(monthlyData.balance)}
            </Text>
          </View>
        </View>

        {/* Income vs Expense Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>{t('analytics.incomeVsExpense')}</Text>
          <BarChart
            data={barData}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={false}
            fromZero={true}
          />
        </View>

        {/* Category Breakdown */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>{t('analytics.categoryWise')} - {t('analytics.expenses')}</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
            style={styles.chart}
          />
        </View>

        {/* Category Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>{t('analytics.categoryWise')} - Detalhes</Text>
          
          {pieData.map((item, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
              <Text style={styles.categoryPercentage}>{item.population}%</Text>
            </View>
          ))}
            </View>
          </>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#FF5722',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  balanceText: {
    color: '#333',
  },
  chartCard: {
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
  chart: {
    borderRadius: 16,
    marginTop: 10,
  },
  detailsCard: {
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
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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

