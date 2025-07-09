document.addEventListener('DOMContentLoaded', () => {
  AffiliateSystem.initUserData();
  
  const registerForm = document.getElementById('registerForm');
  const phoneInput = document.getElementById('phone');
  
  // Format phone input
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.substring(0, 9);
    e.target.value = value;
  });
  
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = `0${document.getElementById('phone').value.trim()}`; // Add leading 0
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const referralCode = document.getElementById('referralCode').value.trim();
    const termsAccepted = document.getElementById('terms').checked;
    
    // Validation
    if (!name || !phone || !gender || !password || !confirmPassword || !termsAccepted) {
      alert('Please fill all required fields and accept terms');
      return;
    }
    
    if (!AffiliateSystem.validatePhone(phone)) {
      alert('Please enter a valid Kenyan phone number starting with 07 (10 digits)');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Save user (simulating API)
    const data = JSON.parse(localStorage.getItem('userData'));
    const formattedPhone = AffiliateSystem.formatPhone(phone);
    
    // Check if user exists
    if (data.users.some(u => u.phone === formattedPhone)) {
      alert('This phone number is already registered');
      return;
    }
    
    // Create new user
    const newUser = {
      name,
      phone: formattedPhone,
      gender,
      password, // Note: In production, never store plain text passwords
      referralCode: referralCode || generateReferralCode(),
      registeredAt: new Date().toISOString(),
      active: false
    };
    
    data.users.push(newUser);
    data.currentUser = formattedPhone;
    
    // Initialize balance
    if (!data.balances[formattedPhone]) {
      data.balances[formattedPhone] = { total: 0, deposit: 0, withdrawn: 0, invite: 0 };
    }
    
    // If referred, credit the referrer
    if (referralCode) {
      const referrer = data.users.find(u => u.referralCode === referralCode);
      if (referrer) {
        // Credit referrer Ksh 100 when the new user activates
        // We'll handle this in the activation process
      }
    }
    
    localStorage.setItem('userData', JSON.stringify(data));
    
    // Redirect to activation
    window.location.href = 'activate.html';
  });
});