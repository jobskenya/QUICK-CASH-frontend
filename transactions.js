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
  
  // Set avatar initials
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  document.getElementById('userAvatar').textContent = initials;
  
  // Load transactions
  loadTransactions();
  
  // Filter button
  document.getElementById('filterBtn').addEventListener('click', loadTransactions);
});

function loadTransactions() {
  const typeFilter = document.getElementById('typeFilter').value;
  const timeFilter = document.getElementById('timeFilter').value;
  
  let transactions = AffiliateSystem.getTransactions();
  
  // Apply filters
  if (typeFilter !== 'all') {
    transactions = transactions.filter(t => t.type === typeFilter);
  }
  
  if (timeFilter !== 'all') {
    const now = new Date();
    let startDate;
    
    if (timeFilter === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeFilter === 'week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (timeFilter === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    transactions = transactions.filter(t => new Date(t.time) >= startDate);
  }
  
  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.time) - new Date(a.time));
  
  const tbody = document.getElementById('transactionsList');
  const emptyState = document.getElementById('emptyState');
  
  tbody.innerHTML = '';
  
  if (transactions.length === 0) {
    tbody.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  
  tbody.classList.remove('hidden');
  emptyState.classList.add('hidden');
  
  transactions.forEach(txn => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';
    
    const typeClass = txn.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 
                     txn.type === 'withdraw' ? 'text-red-600 dark:text-red-400' : 
                     'text-blue-600 dark:text-blue-400';
    
    const typeText = txn.type === 'deposit' ? 'Deposit' :
                    txn.type === 'withdraw' ? 'Withdrawal' :
                    txn.type === 'invite' ? 'Invite' :
                    'Marketing';
    
    row.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${txn.title}</td>
      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${new Date(txn.time).toLocaleString()}</td>
      <td class="px-4 py-3 whitespace-nowrap text-sm ${typeClass} font-medium">${txn.type === 'withdraw' ? '-' : '+'}${formatCurrency(txn.amount)}</td>
      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeClass} bg-opacity-10">${typeText}</span>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}