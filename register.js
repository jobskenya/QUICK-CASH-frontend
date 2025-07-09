document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Registering...';

    try {
      // Format phone (ensure Kenyan number)
      let phone = form.phone.value.trim();
      if (phone.startsWith('0')) phone = `254${phone.substring(1)}`;
      if (phone.startsWith('7')) phone = `254${phone}`;

      const response = await fetch('https://affiliate-backend-v1eo.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name.value.trim(),
          phone,
          gender: form.gender.value,
          password: form.password.value,
          referralCode: form.referralCode.value.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and redirect to activation
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.nextStep === 'activation') {
        window.location.href = 'activate.html';
      } else {
        window.location.href = 'dashboard.html';
      }

    } catch (error) {
      alert(`Registration Error: ${error.message}`);
      console.error('Registration failed:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Register';
    }
  });

  // Phone number formatting
  const phoneInput = form.querySelector('#phone');
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('254')) value = value.substring(3);
    if (value.length > 9) value = value.substring(0, 9);
    e.target.value = value;
  });
});
