// Simple confetti animation
let confettiInterval;

function startConfetti() {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
  
  confettiInterval = setInterval(() => {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = `${Math.random() * 10 + 5}px`;
    
    document.body.appendChild(confetti);
    
    // Animation
    const animationDuration = Math.random() * 3 + 2;
    confetti.style.animation = `fall ${animationDuration}s linear forwards`;
    
    // Remove after animation
    setTimeout(() => {
      confetti.remove();
    }, animationDuration * 1000);
  }, 100);
}

function stopConfetti() {
  clearInterval(confettiInterval);
  document.querySelectorAll('.confetti').forEach(c => c.remove());
}

// Add styles for confetti
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      top: 100vh;
      opacity: 0;
    }
  }
  .confetti {
    position: fixed;
    top: -10px;
    z-index: 9999;
    border-radius: 50%;
  }
`;
document.head.appendChild(style);