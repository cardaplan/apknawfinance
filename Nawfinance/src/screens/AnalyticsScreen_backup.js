import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [selectedYear, setSelectedYear] = useState('2025');
  
  const periods = ['Weekly', 'Monthly', 'Yearly'];
  
  // Sample data for charts
  const pieData = [
    {
      name: 'Bills & Utilities',
      population: 554,
      color: '#FF5722',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Entertainment',
      population: 518,
      color: '#E91E63',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Education',
      population: 350,
      color: '#3F51B5',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Food & Dining',
      population: 283,
      color: '#FF9800',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Healthcare',
      population: 240,
      color: '#9C27B0',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Shopping',
      population: 180,
      color: '#607D8B',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [6.5, 7.2, 6.8, 7.5, 8.2, 7.8, 8.5, 7.9, 8.1, 7.6, 8.3, 7.4],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Income color
      },
      {
        data: [2.1, 2.5, 2.2, 2.8, 3.1, 2.9, 3.2, 2.7, 3.0, 2.6, 3.3, 2.4],
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // Expense color
      }
    ],
  };

  const incomeCategories = [
    { name: 'Salary', amount: 3500.00, color: '#4CAF50' },
    { name: 'Freelance/Contract Work', amount: 1450.00, color: '#8BC34A' },
    { name: 'Rental Income', amount: 1100.00, color: '#CDDC39' },
    { name: 'Other Income', amount: 600.00, color: '#FFC107' },
    { name: 'Investment Income', amount: 370.00, color: '#FF9800' },
    { name: 'Refunds/Reimbursements', amount: 75.00, color: '#FF5722' },
  ];

  const financialSummary = {
    totalBalance: 49759.75,
    monthlyIncome: 7185.00,
    monthlyExpenses: 2533.00,
    netCashFlow: 4652.00,
    totalTransactions: 232,
  };

  const formatAmount = (amount) => {
    return `¥${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* This Month Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>This Month</Text>
          <View style={styles.summaryBars}>
            <View style={styles.summaryBar}>
              <Text style={styles.summaryLabel}>Income</Text>
              <View style={[styles.bar, { backgroundColor: '#4CAF50', width: '77%' }]} />
              <Text style={styles.summaryPercentage}>€7.18k</Text>
            </View>
            <View style={styles.summaryBar}>
              <Text style={styles.summaryLabel}>Expense</Text>
              <View style={[styles.bar, { backgroundColor: '#FF9800', width: '52%' }]} />
              <Text style={styles.summaryPercentage}>€2.5k</Text>
            </View>
            <View style={styles.summaryBar}>
              <Text style={styles.summaryLabel}>Balance</Text>
              <View style={[styles.bar, { backgroundColor: '#333', width: '64%' }]} />
              <Text style={styles.summaryPercentage}>+€4.6k</Text>
            </View>
          </View>
        </View>

        {/* Category Wise Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>Category Wise</Text>
            <View style={styles.periodSelector}>
              <TouchableOpacity style={styles.periodButton}>
                <Ionicons name="chevron-back" size={16} color="#4CAF50" />
              </TouchableOpacity>
              <Text style={styles.periodText}>July 2025</Text>
              <TouchableOpacity style={styles.periodButton}>
                <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.tabSelector}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Expenses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Income</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.totalAmount}>€2,533.00</Text>
          
          <PieChart
            data={pieData}
            width={screenWidth - 80}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          
          <View style={styles.categoryList}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text style={styles.categoryName}>{item.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>€{item.population}.00</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Income vs Expense Analysis */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Income vs Expense Analysis</Text>
          
          <View style={styles.tabSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.tab,
                  selectedPeriod === period && styles.activeTab
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.tabText,
                  selectedPeriod === period && styles.activeTabText
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.periodSelector}>
            <TouchableOpacity style={styles.periodButton}>
              <Ionicons name="chevron-back" size={16} color="#4CAF50" />
            </TouchableOpacity>
            <Text style={styles.periodText}>2025</Text>
            <TouchableOpacity style={styles.periodButton}>
              <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.incomeExpenseLabels}>
            <Text style={styles.incomeText}>Income: €67,952.00</Text>
            <Text style={styles.expenseText}>Expenses: €18,192.25</Text>
          </View>
          
          <BarChart
            data={barData}
            width={screenWidth - 80}
            height={220}
            yAxisLabel="€"
            yAxisSuffix="k"
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#4CAF50',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Expense</Text>
            </View>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Financial Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Balance</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                +{formatAmount(financialSummary.totalBalance)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly Income</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                +{formatAmount(financialSummary.monthlyIncome)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly Expenses</Text>
              <Text style={[styles.summaryValue, { color: '#F44336' }]}>
                -{formatAmount(financialSummary.monthlyExpenses)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net Cash Flow</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                +{formatAmount(financialSummary.netCashFlow)}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Transactions</Text>
              <Text style={styles.summaryValue}>
                {financialSummary.totalTransactions}
              </Text>
            </View>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
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
    shadowRadius: 8,
    elevation: 4,
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
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryBars: {
    gap: 12,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    flex: 1,
  },
  summaryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 50,
    textAlign: 'right',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  periodButton: {
    padding: 4,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  categoryList: {
    marginTop: 16,
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  incomeExpenseLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  incomeText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  expenseText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  summaryGrid: {
    gap: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

