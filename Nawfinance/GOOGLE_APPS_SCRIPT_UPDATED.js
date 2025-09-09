/**
 * Google Apps Script para Integração com Aplicativo de Carteira Digital
 * 
 * Este script deve ser implantado como um Web App no Google Apps Script
 * para permitir que o aplicativo React Native acesse e manipule dados
 * na planilha do Google Sheets.
 * 
 * CONFIGURAÇÃO NECESSÁRIA:
 * 1. Substitua SPREADSHEET_ID pelo ID da sua planilha
 * 2. Certifique-se de que sua planilha tenha as abas "Transactions" e "Categories"
 * 3. Configure as colunas conforme especificado abaixo
 * 
 * ESTRUTURA DA PLANILHA:
 * 
 * Aba "Transactions":
 * A: Date | B: Description | C: Amount | D: Type | E: Category | F: Remarks
 * 
 * Aba "Categories":
 * A: Name | B: Type
 */

// SUBSTITUA PELO ID DA SUA PLANILHA
const SPREADSHEET_ID = '1oRHQTApGbXCgg2-c6yPIlict_WfRCnBvl-vwtJdH8RI';

/**
 * Função principal que processa todas as requisições HTTP
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch (action) {
      case 'test':
        return createResponse({ status: 'success', message: 'Connection successful' });
      
      case 'getTransactions':
        return createResponse(getTransactions());
      
      case 'getBalanceSummary':
        return createResponse(getBalanceSummary());
      
      case 'getAnalytics':
        const period = e.parameter.period || 'monthly';
        return createResponse(getAnalytics(period));
      
      case 'getCategories':
        return createResponse(getCategories());
      
      default:
        return createResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return createResponse({ error: error.toString() }, 500);
  }
}

/**
 * Função para processar requisições POST
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'addTransaction':
        return createResponse(addTransaction(data.data));
      
      case 'updateTransaction':
        return createResponse(updateTransaction(data.id, data.data));
      
      case 'deleteTransaction':
        return createResponse(deleteTransaction(data.id));
      
      case 'addCategory':
        return createResponse(addCategory(data.data));
      
      default:
        return createResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse({ error: error.toString() }, 500);
  }
}

/**
 * Busca todas as transações da planilha
 */
function getTransactions() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const transactions = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) { // Se há data na primeira coluna
      transactions.push({
        date: formatDateToISO(row[0]),
        description: row[1] || '',
        amount: parseFloat(row[2]) || 0,
        type: row[3] || '',
        category: row[4] || '',
        remarks: row[5] || ''
      });
    }
  }
  
  return transactions;
}

/**
 * Adiciona uma nova transação à planilha
 */
function addTransaction(transaction) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  
  // Converte a data do formato DD-MM-YYYY para Date
  const date = parseDate(transaction.date);
  
  const newRow = [
    date,
    transaction.description,
    parseFloat(transaction.amount),
    transaction.type,
    transaction.category,
    transaction.remarks || ''
  ];
  
  sheet.appendRow(newRow);
  
  return { 
    status: 'success', 
    message: 'Transaction added successfully',
    data: transaction
  };
}

/**
 * Calcula o resumo do saldo (total, receitas, despesas)
 */
function getBalanceSummary() {
  const transactions = getTransactions();
  
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach(transaction => {
    if (transaction.type === 'Income') {
      totalIncome += transaction.amount;
    } else if (transaction.type === 'Expense') {
      totalExpenses += Math.abs(transaction.amount);
    }
  });
  
  const totalBalance = totalIncome - totalExpenses;
  
  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    transactionCount: transactions.length
  };
}

/**
 * Gera dados de análise (gráficos e estatísticas)
 */
function getAnalytics(period = 'monthly') {
  const transactions = getTransactions();
  
  // Análise por categoria
  const categoryData = {};
  const monthlyData = {};
  
  transactions.forEach(transaction => {
    // Análise por categoria (apenas despesas)
    if (transaction.type === 'Expense') {
      const category = transaction.category;
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += Math.abs(transaction.amount);
    }
    
    // Análise mensal
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'Income') {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expenses += Math.abs(transaction.amount);
    }
  });
  
  // Converte dados de categoria para formato de gráfico
  const totalExpenses = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);
  const categoryChartData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    population: Math.round((amount / totalExpenses) * 100),
    color: getCategoryColor(category),
    legendFontColor: '#333',
    legendFontSize: 12
  }));
  
  // Converte dados mensais para formato de gráfico
  const monthlyEntries = Object.entries(monthlyData).slice(-6); // Últimos 6 meses
  const monthlyTrends = {
    labels: monthlyEntries.map(([month]) => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return monthNames[parseInt(monthNum) - 1];
    }),
    datasets: [
      {
        data: monthlyEntries.map(([, data]) => data.income),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: monthlyEntries.map(([, data]) => data.expenses),
        color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Receitas', 'Despesas']
  };
  
  return {
    categoryData: categoryChartData,
    monthlyTrends: monthlyTrends
  };
}

/**
 * Busca todas as categorias da planilha
 */
function getCategories() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Categories');
  
  // Se a aba não existir, cria categorias padrão
  if (!sheet) {
    return getDefaultCategories();
  }
  
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return getDefaultCategories();
  }
  
  const categories = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      categories.push({
        name: row[0],
        type: row[1] || 'Expense'
      });
    }
  }
  
  return categories;
}

/**
 * Adiciona uma nova categoria
 */
function addCategory(category) {
  let sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Categories');
  
  // Se a aba não existir, cria ela
  if (!sheet) {
    sheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet('Categories');
    sheet.appendRow(['Name', 'Type']); // Headers
  }
  
  sheet.appendRow([category.name, category.type]);
  
  return { 
    status: 'success', 
    message: 'Category added successfully',
    data: category
  };
}

/**
 * Categorias padrão caso não existam na planilha
 */
function getDefaultCategories() {
  return [
    { name: 'Salário', type: 'Income' },
    { name: 'Freelance/Trabalho por Contrato', type: 'Income' },
    { name: 'Renda de Aluguel', type: 'Income' },
    { name: 'Renda de Investimento', type: 'Income' },
    { name: 'Presentes/Doações', type: 'Income' },
    { name: 'Reembolsos', type: 'Income' },
    { name: 'Outras Receitas', type: 'Income' },
    { name: 'Alimentação', type: 'Expense' },
    { name: 'Transporte', type: 'Expense' },
    { name: 'Moradia', type: 'Expense' },
    { name: 'Contas e Utilidades', type: 'Expense' },
    { name: 'Entretenimento', type: 'Expense' },
    { name: 'Saúde', type: 'Expense' },
    { name: 'Educação', type: 'Expense' },
    { name: 'Compras', type: 'Expense' },
    { name: 'Cuidados Pessoais', type: 'Expense' },
    { name: 'Outras Despesas', type: 'Expense' }
  ];
}

/**
 * Utilitários para formatação e conversão
 */
function formatDateToISO(date) {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date;
}

function parseDate(dateString) {
  // Converte DD-MM-YYYY para Date
  if (typeof dateString === 'string' && dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      // Assume DD-MM-YYYY
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
  }
  return new Date(dateString);
}

function getCategoryColor(category) {
  const colors = {
    'Alimentação': '#FF9800',
    'Transporte': '#2196F3',
    'Moradia': '#9C27B0',
    'Contas e Utilidades': '#FF5722',
    'Entretenimento': '#E91E63',
    'Saúde': '#4CAF50',
    'Educação': '#3F51B5',
    'Compras': '#FF5722',
    'Cuidados Pessoais': '#E91E63',
    'Outras Despesas': '#757575'
  };
  return colors[category] || '#757575';
}

/**
 * Cria resposta HTTP padronizada
 */
function createResponse(data, status = 200) {
  const response = {
    status: status === 200 ? 'success' : 'error',
    data: data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Função para lidar com requisições OPTIONS (CORS)
 */
function doOptions() {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

