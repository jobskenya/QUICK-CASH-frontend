document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'login.html';

  try {
    // Fetch user data
    const userRes = await fetch('https://your-render-url.onrender.com/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const user = await userRes.json();

    // Fetch balances
    const balanceRes = await fetch('https://your-render-url.onrender.com/api/balances', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const balances = await balanceRes.json();

    // Update UI
    document.getElementById('userName').textContent = user.name;
    document.getElementById('totalBalance').textContent = `Ksh ${balances.total_balance}`;
    
  } catch (error) {
    console.error('Dashboard error:', error);
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
});
