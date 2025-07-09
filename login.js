document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Logging in...';

    try {
      // Format phone
      let phone = form.phone.value.trim();
      if (phone.startsWith('0')) phone = `254${phone.substring(1)}`;
      if (phone.startsWith('7')) phone = `254${phone}`;

      const response = await fetch('https://affiliate-backend-v1eo.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone,
          password: form.password.value
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle activation requirement
        if (data.requiresActivation) {
          localStorage.setItem('tempToken', data.tempToken); // If you implement this
          return window.location.href = 'activate.html?returnTo=login';
        }
        throw new Error(data.message || 'Login failed');
      }

      // Store token and redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';

    } catch (error) {
      alert(`Login Error: ${error.message}`);
      console.error('Login failed:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Login';
    }
  });

  // Phone input formatting
  form.querySelector('#phone').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 9);
  });
});
