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
  
  // Load balances
  updateBalances();
  
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
  const available = Math.max(0, balance.total);
  
  document.getElementById('totalBalance').textContent = formatCurrency(balance.total);
  document.getElementById('availableBalance').textContent = formatCurrency(available);
  
  // Update progress
  const progress = Math.min((balance.total / 5000) * 100, 100);
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${formatCurrency(balance.total)} / ${formatCurrency(5000)}`;
  
  // Check for confetti celebration
  if (balance.total >= 5000) {
    triggerConfetti();
  }
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