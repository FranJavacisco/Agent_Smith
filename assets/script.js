const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const loginContainer = document.querySelector('.login-container');
const loginBox = document.querySelector('.login-box');
const passwordInput = document.querySelector('.password-input');
const messageDiv = document.querySelector('.message');

// Configuración
const secretWord = "MATRIX";
let revealedLetters = new Set();
let lastRevealTime = 0;
const revealInterval = 3000; // 3 segundos entre cada revelación
let startRevealTime = 5000; // Tiempo de inicio para revelar las letras (5 segundos)

// Ajustar tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Caracteres para la lluvia
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const fontSize = 14;
const columns = Math.floor(canvas.width/fontSize);
const drops = new Array(columns).fill(0);

// Colores
const regularColor = "#22b455";
const highlightColor = "#ff0000"; // Cambiado a rojo

function draw() {
    // Efecto de desvanecimiento
    ctx.fillStyle = "rgba(2, 2, 4, 0.035)"; // Reducido el desvanecimiento para ralentizar la caída
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";
    
    const currentTime = Date.now();
    
    for(let i = 0; i < drops.length; i++) {
        // Decidir si revelar una letra secreta
        let shouldReveal = currentTime - startRevealTime > 0 && // Comienza a revelar después de 5 segundos
                            currentTime - lastRevealTime > revealInterval &&
                            Math.random() < 0.001 &&
                            revealedLetters.size < secretWord.length;
        
        if(shouldReveal) {
            let unrevealedLetters = [...secretWord].filter(l => !revealedLetters.has(l));
            if(unrevealedLetters.length > 0) {
                let letterToReveal = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
                revealedLetters.add(letterToReveal);
                ctx.fillStyle = highlightColor;
                ctx.fillText(letterToReveal, (i * fontSize) + 30, drops[i] * fontSize); // Letra a la derecha
                lastRevealTime = currentTime;
            }
        } else {
            // Caracteres normales
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            ctx.fillStyle = regularColor;
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        }

        // Reiniciar la gota cuando llegue al final
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.955) {
            drops[i] = 0;
        }
        drops[i] += 0.5; // Velocidad de caída reducida (más lenta)
    }
}

// Mostrar login al mover el mouse o tocar la pantalla
function showLogin() {
    loginContainer.classList.add('visible');
    loginBox.classList.add('active');
}

// Eventos
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', showLogin);
} else {
    document.addEventListener('mousemove', showLogin);
}

// Verificar contraseña
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (passwordInput.value.toUpperCase() === secretWord) {
            messageDiv.style.color = highlightColor;
            messageDiv.textContent = "Acceso Concedido...";
            setTimeout(() => {
                // Aquí puedes redirigir al blog
                window.location.href = '/blog';
            }, 2000);
        } else {
            messageDiv.style.color = '#ff0000';
            messageDiv.textContent = "Código Incorrecto";
            passwordInput.value = '';
            setTimeout(() => {
                messageDiv.textContent = '';
            }, 2000);
        }
    }
});

// Iniciar animación
function animate() {
    requestAnimationFrame(animate);
    draw();
}

animate();
