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
        
        matrixBg.appendChild(rain);

        setInterval(() => {
            const char = document.createElement('div');
            char.textContent = characters.charAt(Math.floor(Math.random() * characters.length));
            rain.appendChild(char);
            
            if (rain.children.length > 20) {
                rain.removeChild(rain.firstChild);
            }
        }, 50);
    }
}

createMatrixRain();

