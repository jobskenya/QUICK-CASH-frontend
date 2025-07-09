// utils.js - Updated for backend API integration
const API_BASE_URL = "https://affiliate-backend-v1eo.onrender.com/api";

class AffiliateSystem {
  static async apiRequest(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // User Management
  static async registerUser(userData) {
    return this.apiRequest('/auth/register', 'POST', userData);
  }

  static async loginUser(credentials) {
    const data = await this.apiRequest('/auth/login', 'POST', credentials);
    localStorage.setItem('token', data.token);
    return data.user;
  }

  static async getCurrentUser() {
    try {
      return await this.apiRequest('/auth/me');
    } catch (error) {
      return null;
    }
  }

  // Transactions
  static async getTransactions() {
    return this.apiRequest('/transactions');
  }

  static async addTransaction(transaction) {
    return this.apiRequest('/transactions', 'POST', transaction);
  }

  // Balance
  static async getBalance() {
    return this.apiRequest('/balance');
  }

  // MPesa
  static async initiateSTKPush(phone, amount) {
    return this.apiRequest('/mpesa/stk-push', 'POST', { phone, amount });
  }
}

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES' 
  }).format(amount);
}

function handleApiError(error) {
  console.error('API Error:', error);
  alert(error.message || 'An error occurred. Please try again.');
}

// Initialize dark mode (unchanged)
function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  document.documentElement.classList.toggle('dark', darkMode);
  return darkMode;
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
  return isDark;
}
