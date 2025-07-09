// utils.js - Enhanced with better phone validation and login support
class AffiliateSystem {
  static initUserData() {
    if (!localStorage.getItem('userData')) {
      localStorage.setItem('userData', JSON.stringify({
        users: [],
        currentUser: null,
        transactions: [],
        balances: {}
      }));
    }
  }

  static validatePhone(phone) {
    // Kenyan phone numbers starting with 07 (10 digits total)
    return /^07\d{8}$/.test(phone);
  }

  static formatPhone(phone) {
    // Convert 07 to 254 for storage
    if (phone.startsWith('07') && phone.length === 10) {
      return `254${phone.substring(1)}`;
    }
    return phone;
  }

  static displayPhone(phone) {
    // Convert 254 to 07 for display
    if (phone.startsWith('254') && phone.length === 12) {
      return `0${phone.substring(3)}`;
    }
    return phone;
  }

  static getCurrentUser() {
    const data = JSON.parse(localStorage.getItem('userData'));
    return data.currentUser ? data.users.find(u => u.phone === data.currentUser) : null;
  }

  static getUserBalance() {
    const user = this.getCurrentUser();
    if (!user) return { total: 0, deposit: 0, withdrawn: 0, invite: 0 };
    const data = JSON.parse(localStorage.getItem('userData'));
    return data.balances[user.phone] || { total: 0, deposit: 0, withdrawn: 0, invite: 0 };
  }

  static updateUserBalance(amount, type = 'invite') {
    const user = this.getCurrentUser();
    if (!user) return false;

    const data = JSON.parse(localStorage.getItem('userData'));
    if (!data.balances[user.phone]) {
      data.balances[user.phone] = { total: 0, deposit: 0, withdrawn: 0, invite: 0 };
    }

    const balance = data.balances[user.phone];
    if (type === 'deposit') balance.deposit += amount;
    if (type === 'invite') balance.invite += amount;
    if (type === 'withdraw') balance.withdrawn += amount;
    balance.total = balance.deposit + balance.invite - balance.withdrawn;

    localStorage.setItem('userData', JSON.stringify(data));
    return true;
  }

  static addTransaction(title, amount, type) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const data = JSON.parse(localStorage.getItem('userData'));
    data.transactions.push({
      user: user.phone,
      title,
      amount,
      type,
      time: new Date().toISOString()
    });
    localStorage.setItem('userData', JSON.stringify(data));
    return true;
  }

  static getTransactions() {
    const user = this.getCurrentUser();
    if (!user) return [];
    const data = JSON.parse(localStorage.getItem('userData'));
    return data.transactions.filter(t => t.user === user.phone);
  }

  static loginUser(phone, password) {
    const data = JSON.parse(localStorage.getItem('userData'));
    const formattedPhone = this.formatPhone(phone);
    const user = data.users.find(u => u.phone === formattedPhone && u.password === password);
    
    if (user) {
      data.currentUser = formattedPhone;
      localStorage.setItem('userData', JSON.stringify(data));
      return true;
    }
    return false;
  }
}

// Initialize dark mode
function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  document.documentElement.classList.toggle('dark', darkMode);
  return darkMode;
}

// Toggle dark mode
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
  return isDark;
}

// Navigation helper
function navigateTo(page) {
  window.location.href = `${page}.html`;
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
}

// Generate random referral code
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}