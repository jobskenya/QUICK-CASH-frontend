document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phone = `254${document.getElementById('phone').value.trim()}`;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';

      // Call backend API
      const user = await AffiliateSystem.loginUser({ phone, password });
      
      // Remember phone if checked
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedPhone', phone.substring(3)); // Store without 254
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedPhone');
      }

      // Redirect based on activation status
      window.location.href = user.active ? 'dashboard.html' : 'activate.html';
      
    } catch (error) {
      handleApiError(error);
    } finally {
      // Reset button state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Login';
    }
  });

  // Pre-fill phone if remembered
  if (localStorage.getItem('rememberMe') === 'true') {
    document.getElementById('remember-me').checked = true;
    const savedPhone = localStorage.getItem('savedPhone');
    if (savedPhone) {
      document.getElementById('phone').value = savedPhone;
    }
  }
});
