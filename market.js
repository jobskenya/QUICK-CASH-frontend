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
  
  // Animated share button functionality
  document.querySelectorAll('.share-main-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const service = this.dataset.service;
      const options = this.nextElementSibling;
      
      // Close all other open share options
      document.querySelectorAll('.share-options').forEach(opt => {
        if (opt !== options) opt.classList.add('hidden');
      });
      
      // Toggle this one
      options.classList.toggle('hidden');
    });
  });
  
  // Share option buttons
  document.querySelectorAll('.share-option-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const channel = this.dataset.channel;
      const service = this.closest('.share-options').previousElementSibling.dataset.service;
      shareMarketingContent(service, channel);
      
      // Hide the options after selection
      this.closest('.share-options').classList.add('hidden');
    });
  });
  
  // Close share options when clicking elsewhere
  document.addEventListener('click', () => {
    document.querySelectorAll('.share-options').forEach(opt => {
      opt.classList.add('hidden');
    });
  });
  
  // Invite button (unchanged)
  document.getElementById('inviteBtn').addEventListener('click', () => {
    document.getElementById('inviteModal').classList.remove('hidden');
  });
});

function shareMarketingContent(service, channel) {
  const message = `Check out this amazing ${service} offer! Earn money online easily — register, market and make cash! Register now: https://earn.ke/register?ref=ABC123`;
  
  if (channel === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  } else if (channel === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://earn.ke/register?ref=ABC123')}&quote=${encodeURIComponent(message)}`, '_blank');
  }
  
  // Simulate earning Ksh 50
  AffiliateSystem.updateUserBalance(50, 'invite');
  AffiliateSystem.addTransaction(`Shared Marketing: ${service}`, 50, 'marketing');
  
  // Show feedback
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
  toast.textContent = `You earned Ksh 50 for sharing ${service}!`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}