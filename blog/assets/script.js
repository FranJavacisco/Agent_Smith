// Matrix Rain Effect
function createMatrixRain() {
    const matrixBg = document.getElementById('matrixBg');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const columns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < columns; i++) {
        const rain = document.createElement('div');
        rain.className = 'rain';
        rain.style.left = i * 20 + 'px';
        rain.style.animationDuration = Math.random() * 3 + 1 + 's';
        
        let rainText = '';
        for (let j = 0; j < 50; j++) {
            rainText += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        rain.innerHTML = rainText;
        matrixBg.appendChild(rain);
    }
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Initialize
createMatrixRain();

// Event Listeners
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        showNotification('Accediendo a contenido seguro...');
    });
});

// Resize Handler
window.addEventListener('resize', () => {
    document.getElementById('matrixBg').innerHTML = '';
    createMatrixRain();
});
