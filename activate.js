document.addEventListener('DOMContentLoaded', () => {
  const activateBtn = document.getElementById('activateBtn');
  const checkPayment = document.getElementById('checkPayment');
  
  // Check if user is logged in
  const user = AffiliateSystem.getCurrentUser();
  if (!user) {
    window.location.href = 'register.html';
    return;
  }
  
  // If already active, redirect to dashboard
  if (user.active) {
    window.location.href = 'dashboard.html';
    return;
  }
  
  activateBtn.addEventListener('click', () => {
    // Simulate payment processing
    activateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
    activateBtn.classList.remove('animate__pulse');
    
    setTimeout(() => {
      // Update user as active
      const data = JSON.parse(localStorage.getItem('userData'));
      const userIndex = data.users.findIndex(u => u.phone === user.phone);
      
      if (userIndex !== -1) {
        data.users[userIndex].active = true;
        localStorage.setItem('userData', JSON.stringify(data));
        
        // Add initial deposit transaction
        AffiliateSystem.updateUserBalance(100, 'deposit');
        AffiliateSystem.addTransaction('Account Activation', 100, 'deposit');
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      }
    }, 2000);
  });
  
  checkPayment.addEventListener('click', (e) => {
    e.preventDefault();
    alert('In a real implementation, this would check with your payment processor API');
  });
});