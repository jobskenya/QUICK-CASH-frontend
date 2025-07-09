document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  // Initialize dark mode
  initDarkMode();
  
  // Set up toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const isDark = toggleDarkMode();
      const icon = darkModeToggle.querySelector('i');
      
      if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }
});