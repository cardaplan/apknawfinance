import axios from 'axios';

class GoogleSheetsService {
  constructor() {
    this.apiUrl = null;
    this.spreadsheetId = null;
    this.isConnected = false;
  }

  // Set the Google Sheets Spreadsheet ID
  setSpreadsheetId(id) {
    this.spreadsheetId = id;
  }

  // Set the Google Apps Script URL
  setApiUrl(url) {
    this.apiUrl = url;
  }

  // Test connection to Google Apps Script
  async testConnection() {
    if (!this.apiUrl) {
      throw new Error('API URL not set');
    }

    try {
      const response = await axios.get(`${this.apiUrl}?action=test`);
      this.isConnected = response.status === 200;
      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      throw new Error('Failed to connect to Google Apps Script');
    }
  }

  // Get all transactions
  async getTransactions() {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.get(`${this.apiUrl}?action=getTransactions`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch transactions');
    }
  }

  // Add a new transaction
  async addTransaction(transaction) {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.post(this.apiUrl, {
        action: 'addTransaction',
        data: transaction
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add transaction');
    }
  }

  // Update an existing transaction
  async updateTransaction(id, transaction) {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.post(this.apiUrl, {
        action: 'updateTransaction',
        id: id,
        data: transaction
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update transaction');
    }
  }

  // Delete a transaction
  async deleteTransaction(id) {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.post(this.apiUrl, {
        action: 'deleteTransaction',
        id: id
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete transaction');
    }
  }

  // Get analytics data
  async getAnalytics(period = 'monthly') {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.get(`${this.apiUrl}?action=getAnalytics&period=${period}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch analytics data');
    }
  }

  // Get categories
  async getCategories() {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.get(`${this.apiUrl}?action=getCategories`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }

  // Add a new category
  async addCategory(category) {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.post(this.apiUrl, {
        action: 'addCategory',
        data: category
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add category');
    }
  }

  // Get filtered transactions
  async getFilteredTransactions(filters) {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.post(this.apiUrl, {
        action: 'getFilteredTransactions',
        filters: filters
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch filtered transactions');
    }
  }

  // Get balance summary
  async getBalanceSummary() {
    if (!this.apiUrl || !this.isConnected) {
      throw new Error('Not connected to Google Sheets');
    }

    try {
      const response = await axios.get(`${this.apiUrl}?action=getBalanceSummary`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch balance summary');
    }
  }
}

// Create a singleton instance
const googleSheetsService = new GoogleSheetsService();

export default googleSheetsService;

