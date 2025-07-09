document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check authentication
    const user = await AffiliateSystem.getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
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

    // Load data
    await updateBalances();
    await loadTransactions();

    // Set up event listeners
    document.getElementById('withdrawBtn').addEventListener('click', handleWithdraw);
    document.getElementById('closeModal').addEventListener('click', () => {
      document.getElementById('withdrawalModal').classList.add('hidden');
    });
    document.getElementById('inviteFriendsBtn').addEventListener('click', () => {
      window.location.href = 'market.html';
    });

  } catch (error) {
    handleApiError(error);
  }
});

async function updateBalances() {
  const balance = await AffiliateSystem.getBalance();
  
  document.getElementById('totalBalance').textContent = formatCurrency(balance.total);
  document.getElementById('depositBalance').textContent = formatCurrency(balance.deposit);
  document.getElementById('withdrawnBalance').textContent = formatCurrency(balance.withdrawn);
  document.getElementById('inviteBalance').textContent = formatCurrency(balance.invite);
  
  // Update progress
  const progress = Math.min((balance.total / 5000) * 100, 100);
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${formatCurrency(balance.total)} / ${formatCurrency(5000)}`;
}

async function loadTransactions() {
  const transactions = await AffiliateSystem.getTransactions();
  const tbody = document.getElementById('transactionsList');
  tbody.innerHTML = '';
  
  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-gray-500 dark:text-gray-400">No transactions yet</td></tr>';
    return;
  }
  
  transactions.slice(0, 5).forEach(txn => {
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

async function handleWithdraw() {
  try {
    const balance = await AffiliateSystem.getBalance();
    
    if (balance.total < 5000) {
      // Show modal
      document.getElementById('currentBalanceModal').textContent = formatCurrency(balance.total);
      document.getElementById('modalProgressBar').style.width = `${(balance.total / 5000) * 100}%`;
      document.getElementById('withdrawalModal').classList.remove('hidden');
    } else {
      // In a real app, this would call your backend's withdrawal endpoint
      alert('Withdrawal request submitted! This would call your backend in production.');
    }
  } catch (error) {
    handleApiError(error);
  }
}
