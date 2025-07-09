document.addEventListener('DOMContentLoaded', () => {
  const user = AffiliateSystem.getCurrentUser();
  
  // Redirect if not logged in or not active
  if (!user) {
    window.location.href = 'register.html';
    return;
  }
  
  if (!user.active) {
    window.location.href = 'activate.html';
    return;
  }
  
  // Load user data
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userGender').textContent = user.gender === 'male' ? 'Male' : 'Female';
  
  // Set avatar initials
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('profileAvatar').textContent = initials;
  
  // Load balances
  updateBalances();
  
  // Load transactions
  loadTransactions();
  
  // Withdraw button
  document.getElementById('withdrawBtn').addEventListener('click', handleWithdraw);
  
  // Modal buttons
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('withdrawalModal').classList.add('hidden');
  });
  
  document.getElementById('inviteFriendsBtn').addEventListener('click', () => {
    window.location.href = 'market.html';
  });
});

function updateBalances() {
  const balance = AffiliateSystem.getUserBalance();
  
  document.getElementById('totalBalance').textContent = formatCurrency(balance.total);
  document.getElementById('depositBalance').textContent = formatCurrency(balance.deposit);
  document.getElementById('withdrawnBalance').textContent = formatCurrency(balance.withdrawn);
  document.getElementById('inviteBalance').textContent = formatCurrency(balance.invite);
  
  // Update progress
  const progress = Math.min((balance.total / 5000) * 100, 100);
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${formatCurrency(balance.total)} / ${formatCurrency(5000)}`;
  
  // Check for confetti celebration
  if (balance.total >= 5000) {
    triggerConfetti();
  }
}

function loadTransactions() {
  const transactions = AffiliateSystem.getTransactions().slice(0, 5); // Get last 5 transactions
  const tbody = document.getElementById('transactionsList');
  tbody.innerHTML = '';
  
  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-gray-500 dark:text-gray-400">No transactions yet</td></tr>';
    return;
  }
  
  transactions.forEach(txn => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';
    
    const typeClass = txn.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 
                     txn.type === 'withdraw' ? 'text-red-600 dark:text-red-400' : 
                     'text-blue-600 dark:text-blue-400';
    
    row.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${txn.title}</td>
      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${new Date(txn.time).toLocaleString()}</td>
      <td class="px-4 py-3 whitespace-nowrap text-sm ${typeClass} font-medium">${txn.type === 'withdraw' ? '-' : '+'}${formatCurrency(txn.amount)}</td>
    `;
    
    tbody.appendChild(row);
  });
}

function handleWithdraw() {
  const balance = AffiliateSystem.getUserBalance();
  
  if (balance.total < 5000) {
    // Show modal
    document.getElementById('currentBalanceModal').textContent = formatCurrency(balance.total);
    document.getElementById('modalProgressBar').style.width = `${(balance.total / 5000) * 100}%`;
    document.getElementById('withdrawalModal').classList.remove('hidden');
  } else {
    // Open WhatsApp for withdrawal
    const user = AffiliateSystem.getCurrentUser();
    const message = `Please allow my withdrawal of ${formatCurrency(balance.total)} for user ${user.name}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=+254104718105&text=${encodedMessage}`, '_blank');
  }
}

function triggerConfetti() {
  // Confetti animation will be triggered from confetti.js
  startConfetti();
  setTimeout(stopConfetti, 5000);
}