// Elementos del DOM
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const loginContainer = document.querySelector('.login-container');
const loginBox = document.querySelector('.login-box');
const passwordInput = document.querySelector('.password-input');
const messageDiv = document.querySelector('.message');
const enterButton = document.querySelector('.enter-button');

// Configuración
const secretWord = "MATRIX";
let revealedLetters = new Set();
let lastRevealTime = 0;
const revealInterval = 3000; // 3 segundos entre cada revelación
const cycleInterval = 5000; // 5 segundos entre ciclos
const initialDelay = 5000; // 5 segundos de retraso inicial
let isRevealing = false;
let startTime = Date.now();

// Seguimiento de letras animadas
let animatedLetters = [];

// Ajustar tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Configuración de la lluvia de código
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const baseFontSize = 14;
const columns = Math.floor(canvas.width/baseFontSize);
const drops = new Array(columns).fill(0);

// Colores
const regularColor = "#22b455";
const highlightColor = "#ff0000";

// Clase para las letras animadas
class AnimatedLetter {
    constructor(letter, x, y) {
        this.letter = letter;
        this.x = x;
        this.y = y;
        this.fontSize = baseFontSize;
        this.maxFontSize = baseFontSize * 3;
        this.speed = 2;
        this.alpha = 1;
    }

    update() {
        this.y += this.speed;
        this.fontSize = Math.min(this.fontSize + 0.5, this.maxFontSize);
        if (this.y > canvas.height) {
            this.alpha -= 0.05;
        }
        return this.alpha > 0;
    }

    draw() {
        ctx.font = `${this.fontSize}px monospace`;
        ctx.fillStyle = `rgba(255, 0, 0, ${this.alpha})`;
        ctx.fillText(this.letter, this.x, this.y);
    }
}

// Control del ciclo de revelación
function resetRevealCycle() {
    revealedLetters.clear();
    isRevealing = true;
    lastRevealTime = Date.now();
}

function startNewCycle() {
    setTimeout(resetRevealCycle, cycleInterval);
}

// Función principal de dibujo
function draw() {
    // Efecto de desvanecimiento
    ctx.fillStyle = "rgba(2, 2, 4, 0.035)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = baseFontSize + "px monospace";
    
    const currentTime = Date.now();
    
    // Dibujar caracteres normales
    for(let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillStyle = regularColor;
        ctx.fillText(char, i * baseFontSize, drops[i] * baseFontSize);

        if(drops[i] * baseFontSize > canvas.height && Math.random() > 0.955) {
            drops[i] = 0;
        }
        drops[i] += 0.5;
    }

    // Revelar letras secretas después del retraso inicial
    if (currentTime - startTime > initialDelay && isRevealing) {
        if (currentTime - lastRevealTime > revealInterval && 
            revealedLetters.size < secretWord.length) {
            
            let unrevealedLetters = [...secretWord].filter(l => !revealedLetters.has(l));
            if (unrevealedLetters.length > 0) {
                let letterToReveal = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
                revealedLetters.add(letterToReveal);
                
                // Crear nueva letra animada
                const randomColumn = Math.floor(Math.random() * columns);
                const x = randomColumn * baseFontSize;
                animatedLetters.push(new AnimatedLetter(letterToReveal, x, 0));
                
                lastRevealTime = currentTime;

                // Si todas las letras han sido reveladas, programar el próximo ciclo
                if (revealedLetters.size === secretWord.length) {
                    isRevealing = false;
                    startNewCycle();
                }
            }
        }
    }

    // Actualizar y dibujar letras animadas
    animatedLetters = animatedLetters.filter(letter => {
        const isAlive = letter.update();
        if (isAlive) {
            letter.draw();
        }
        return isAlive;
    });
}

// Mostrar login
function showLogin() {
    loginContainer.classList.add('visible');
    loginBox.classList.add('active');
}

// Eventos de interacción
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', showLogin);
} else {
    document.addEventListener('mousemove', showLogin);
}

// Verificación de acceso
function checkAccess() {
    const inputValue = passwordInput.value.toUpperCase();
    if (inputValue === secretWord) {
        messageDiv.style.color = highlightColor;
        messageDiv.textContent = "Acceso Concedido...";
        enterButton.classList.add('success');
        
        setTimeout(() => {
            window.location.href = '/blog';
        }, 2000);
    } else {
        messageDiv.style.color = '#ff0000';
        messageDiv.textContent = "Código Incorrecto";
        enterButton.classList.add('error');
        passwordInput.value = '';
        
        setTimeout(() => {
            messageDiv.textContent = '';
            enterButton.classList.remove('error');
        }, 2000);
    }
}

// Eventos para el botón y el input
enterButton.addEventListener('click', checkAccess);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAccess();
    }
});

// Iniciar el primer ciclo de revelación
setTimeout(() => {
    isRevealing = true;
}, initialDelay);

// Iniciar animación
function animate() {
    requestAnimationFrame(animate);
    draw();
}

animate();