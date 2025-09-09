/**
 * Google Apps Script Backend for My Wallet App
 * 
 * This script should be deployed as a web app in Google Apps Script
 * and connected to a Google Sheet with the following columns:
 * A: Date, B: Description, C: Amount, D: Type, E: Category, F: Remarks
 */

// Configuration
const SHEET_NAME = 'Transactions'; // Name of your sheet tab
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your actual spreadsheet ID

/**
 * Handle GET requests - Retrieve transactions
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'getTransactions';
    
    switch (action) {
      case 'getTransactions':
        return getTransactions(e);
      case 'testConnection':
        return testConnection();
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * Handle POST requests - Add/Update/Delete transactions
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'addTransaction':
        return addTransaction(data);
      case 'updateTransaction':
        return updateTransaction(data);
      case 'deleteTransaction':
        return deleteTransaction(data);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * Test connection to the spreadsheet
 */
function testConnection() {
  try {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    return createResponse(true, 'Connection successful', { 
      sheetName: SHEET_NAME,
      totalRows: lastRow 
    });
  } catch (error) {
    return createResponse(false, 'Connection failed: ' + error.message);
  }
}

/**
 * Get all transactions from the sheet
 */
function getTransactions(e) {
  try {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return createResponse(true, 'No transactions found', []);
    }
    
    const range = sheet.getRange(2, 1, lastRow - 1, 6); // Skip header row
    const values = range.getValues();
    
    const transactions = values.map((row, index) => ({
      id: index + 2, // Row number (starting from 2)
      date: formatDate(row[0]),
      description: row[1],
      amount: parseFloat(row[2]) || 0,
      type: row[3],
      category: row[4],
      remarks: row[5] || ''
    })).filter(transaction => transaction.description); // Filter out empty rows
    
    return createResponse(true, 'Transactions retrieved successfully', transactions);
  } catch (error) {
    return createResponse(false, 'Error retrieving transactions: ' + error.message);
  }
}

/**
 * Add a new transaction
 */
function addTransaction(data) {
  try {
    const sheet = getSheet();
    const transaction = data.transaction;
    
    // Validate required fields
    if (!transaction.date || !transaction.description || !transaction.amount || !transaction.type) {
      return createResponse(false, 'Missing required fields');
    }
    
    const newRow = [
      new Date(transaction.date),
      transaction.description,
      parseFloat(transaction.amount),
      transaction.type,
      transaction.category || '',
      transaction.remarks || ''
    ];
    
    sheet.appendRow(newRow);
    
    return createResponse(true, 'Transaction added successfully', {
      id: sheet.getLastRow(),
      ...transaction
    });
  } catch (error) {
    return createResponse(false, 'Error adding transaction: ' + error.message);
  }
}

/**
 * Update an existing transaction
 */
function updateTransaction(data) {
  try {
    const sheet = getSheet();
    const transaction = data.transaction;
    const rowId = transaction.id;
    
    if (!rowId || rowId < 2) {
      return createResponse(false, 'Invalid transaction ID');
    }
    
    const updatedRow = [
      new Date(transaction.date),
      transaction.description,
      parseFloat(transaction.amount),
      transaction.type,
      transaction.category || '',
      transaction.remarks || ''
    ];
    
    const range = sheet.getRange(rowId, 1, 1, 6);
    range.setValues([updatedRow]);
    
    return createResponse(true, 'Transaction updated successfully', transaction);
  } catch (error) {
    return createResponse(false, 'Error updating transaction: ' + error.message);
  }
}

/**
 * Delete a transaction
 */
function deleteTransaction(data) {
  try {
    const sheet = getSheet();
    const rowId = data.id;
    
    if (!rowId || rowId < 2) {
      return createResponse(false, 'Invalid transaction ID');
    }
    
    sheet.deleteRow(rowId);
    
    return createResponse(true, 'Transaction deleted successfully');
  } catch (error) {
    return createResponse(false, 'Error deleting transaction: ' + error.message);
  }
}

/**
 * Get the spreadsheet and sheet
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    // Add headers
    sheet.getRange(1, 1, 1, 6).setValues([
      ['Date', 'Description', 'Amount', 'Type', 'Category', 'Remarks']
    ]);
  }
  
  return sheet;
}

/**
 * Format date for consistent output
 */
function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Create standardized response
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function - Run this once to initialize the sheet
 */
function setupSheet() {
  try {
    const sheet = getSheet();
    console.log('Sheet setup completed successfully');
    console.log('Sheet name:', SHEET_NAME);
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
  } catch (error) {
    console.error('Error setting up sheet:', error);
  }
}

// Additional utility functions for analytics

/**
 * Get transaction summary by month
 */
function getMonthlyAnalytics(e) {
  try {
    const sheet = getSheet();
    const transactions = getTransactions(e);
    
    if (!transactions.success) {
      return transactions;
    }
    
    const data = transactions.data;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyData = data.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const income = monthlyData
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = monthlyData
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return createResponse(true, 'Monthly analytics retrieved', {
      income: income,
      expenses: expenses,
      balance: income - expenses,
      transactionCount: monthlyData.length
    });
  } catch (error) {
    return createResponse(false, 'Error getting analytics: ' + error.message);
  }
}

/**
 * Get category breakdown
 */
function getCategoryAnalytics(e) {
  try {
    const transactions = getTransactions(e);
    
    if (!transactions.success) {
      return transactions;
    }
    
    const data = transactions.data;
    const categoryTotals = {};
    
    data.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += Math.abs(transaction.amount);
    });
    
    return createResponse(true, 'Category analytics retrieved', categoryTotals);
  } catch (error) {
    return createResponse(false, 'Error getting category analytics: ' + error.message);
  }
}

