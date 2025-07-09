document.addEventListener('DOMContentLoaded', () => {
  AffiliateSystem.initUserData();
  
  const loginForm = document.getElementById('loginForm');
  const phoneInput = document.getElementById('phone');
  
  // Format phone input
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    // Ensure it starts with 7 or 1 and has max 9 digits
    if (!/^[71]/.test(value)) {
      value = value.substring(1);
    }
    if (value.length > 9) value = value.substring(0, 9);
    e.target.value = value;
  });
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phone = `0${document.getElementById('phone').value.trim()}`; // Add leading 0
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validation
    if (!AffiliateSystem.validatePhone(phone)) {
      alert('Please enter a valid Kenyan phone number starting with 07 or 01 (10 digits)');
      return;
    }
    
    if (!password) {
      alert('Please enter your password');
      return;
    }
    
    // Attempt login
    if (AffiliateSystem.loginUser(phone, password)) {
      // Remember phone if checked
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedPhone', phone);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedPhone');
      }
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid phone number or password');
    }
  });
  
  // Check if remember me was checked last time
  if (localStorage.getItem('rememberMe') === 'true') {
    document.getElementById('remember-me').checked = true;
    const savedPhone = localStorage.getItem('savedPhone');
    if (savedPhone) {
      // Remove the leading 0 for display
      document.getElementById('phone').value = savedPhone.substring(1);
    }
  }
});