document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner">Loading...</span>';

  try {
    const phone = `254${e.target.phone.value.replace(/^0/, '')}`;
    const response = await fetch('https://your-render-url.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: e.target.name.value,
        phone,
        password: e.target.password.value,
        gender: e.target.gender.value
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    // Save token and redirect
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = data.nextStep === 'activation' ? 'activate.html' : 'dashboard.html';

  } catch (error) {
    alert(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
  }
});
