"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Elementos del DOM
var canvas = document.getElementById('matrix');
var ctx = canvas.getContext('2d');
var loginContainer = document.querySelector('.login-container');
var loginBox = document.querySelector('.login-box');
var passwordInput = document.querySelector('.password-input');
var messageDiv = document.querySelector('.message');
var enterButton = document.querySelector('.enter-button'); // Configuración

var secretWord = "MATRIX";
var revealedLetters = new Set();
var lastRevealTime = 0;
var revealInterval = 3000; // 3 segundos entre cada revelación

var cycleInterval = 5000; // 5 segundos entre ciclos

var initialDelay = 5000; // 5 segundos de retraso inicial

var isRevealing = false;
var startTime = Date.now(); // Seguimiento de letras animadas

var animatedLetters = []; // Ajustar tamaño del canvas

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Configuración de la lluvia de código

var matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
var baseFontSize = 14;
var columns = Math.floor(canvas.width / baseFontSize);
var drops = new Array(columns).fill(0); // Colores

var regularColor = "#22b455";
var highlightColor = "#ff0000"; // Clase para las letras animadas

var AnimatedLetter =
/*#__PURE__*/
function () {
  function AnimatedLetter(letter, x, y) {
    _classCallCheck(this, AnimatedLetter);

    this.letter = letter;
    this.x = x;
    this.y = y;
    this.fontSize = baseFontSize;
    this.maxFontSize = baseFontSize * 3;
    this.speed = 2;
    this.alpha = 1;
  }

  _createClass(AnimatedLetter, [{
    key: "update",
    value: function update() {
      this.y += this.speed;
      this.fontSize = Math.min(this.fontSize + 0.5, this.maxFontSize);

      if (this.y > canvas.height) {
        this.alpha -= 0.05;
      }

      return this.alpha > 0;
    }
  }, {
    key: "draw",
    value: function draw() {
      ctx.font = "".concat(this.fontSize, "px monospace");
      ctx.fillStyle = "rgba(255, 0, 0, ".concat(this.alpha, ")");
      ctx.fillText(this.letter, this.x, this.y);
    }
  }]);

  return AnimatedLetter;
}(); // Control del ciclo de revelación


function resetRevealCycle() {
  revealedLetters.clear();
  isRevealing = true;
  lastRevealTime = Date.now();
}

function startNewCycle() {
  setTimeout(resetRevealCycle, cycleInterval);
} // Función principal de dibujo


function draw() {
  // Efecto de desvanecimiento
  ctx.fillStyle = "rgba(2, 2, 4, 0.035)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = baseFontSize + "px monospace";
  var currentTime = Date.now(); // Dibujar caracteres normales

  for (var i = 0; i < drops.length; i++) {
    var _char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctx.fillStyle = regularColor;
    ctx.fillText(_char, i * baseFontSize, drops[i] * baseFontSize);

    if (drops[i] * baseFontSize > canvas.height && Math.random() > 0.955) {
      drops[i] = 0;
    }

    drops[i] += 0.5;
  } // Revelar letras secretas después del retraso inicial


  if (currentTime - startTime > initialDelay && isRevealing) {
    if (currentTime - lastRevealTime > revealInterval && revealedLetters.size < secretWord.length) {
      var unrevealedLetters = _toConsumableArray(secretWord).filter(function (l) {
        return !revealedLetters.has(l);
      });

      if (unrevealedLetters.length > 0) {
        var letterToReveal = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
        revealedLetters.add(letterToReveal); // Crear nueva letra animada

        var randomColumn = Math.floor(Math.random() * columns);
        var x = randomColumn * baseFontSize;
        animatedLetters.push(new AnimatedLetter(letterToReveal, x, 0));
        lastRevealTime = currentTime; // Si todas las letras han sido reveladas, programar el próximo ciclo

        if (revealedLetters.size === secretWord.length) {
          isRevealing = false;
          startNewCycle();
        }
      }
    }
  } // Actualizar y dibujar letras animadas


  animatedLetters = animatedLetters.filter(function (letter) {
    var isAlive = letter.update();

    if (isAlive) {
      letter.draw();
    }

    return isAlive;
  });
} // Mostrar login


function showLogin() {
  loginContainer.classList.add('visible');
  loginBox.classList.add('active');
} // Eventos de interacción


if ('ontouchstart' in window) {
  document.addEventListener('touchstart', showLogin);
} else {
  document.addEventListener('mousemove', showLogin);
} // Verificación de acceso


function checkAccess() {
  var inputValue = passwordInput.value.toUpperCase();

  if (inputValue === secretWord) {
    messageDiv.style.color = highlightColor;
    messageDiv.textContent = "Acceso Concedido...";
    enterButton.classList.add('success');
    setTimeout(function () {
      window.location.href = '/blog';
    }, 2000);
  } else {
    messageDiv.style.color = '#ff0000';
    messageDiv.textContent = "Código Incorrecto";
    enterButton.classList.add('error');
    passwordInput.value = '';
    setTimeout(function () {
      messageDiv.textContent = '';
      enterButton.classList.remove('error');
    }, 2000);
  }
} // Eventos para el botón y el input


enterButton.addEventListener('click', checkAccess);
passwordInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    checkAccess();
  }
}); // Iniciar el primer ciclo de revelación

setTimeout(function () {
  isRevealing = true;
}, initialDelay); // Iniciar animación

function animate() {
  requestAnimationFrame(animate);
  draw();
}

animate();
//# sourceMappingURL=script.dev.js.map
