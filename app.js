alert("Please read How To Play first to know the controls :D");

let canvas;
let ctx;
let scl = 20;
let raf;
let mySnake;
let running = false;
let apple;
let score;
let high;
let highScore = 0;
let pauseBtn;
let gameContinued = false;
let prevTime;
let threshold = 200;

// All indipendent fucntions lie here
function dist(x1, x2, y1, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function drawFood(food) {
  ctx.fillStyle = "#ff4e0b";
  ctx.fillRect(food.x, food.y, scl, scl);
}

function randPoint(size) {
  return Math.round(Math.random() * (size / scl - 1)) * scl;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * :CREDITS:
 *
 * SWIPE DETECTOR V1.1
 * Made By Good_Bits
 * :)
 *
 * Thanks to this awesome guy :D
 */

let SwipeDetector = (function () {
  let touchStart = null;
  let lastTouch = null;
  let timeout = 500;
  let threshold = 50;
  let eventHandlers = [];
  let lastTime = NaN;
  let disabled = false;

  class vec2D {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    mag() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
  }

  function vec2DSubtract(a, b) {
    return new vec2D(a.x - b.x, a.y - b.y);
  }

  function handleTouchStart(event) {
    touchStart = new vec2D(event.touches[0].clientX, event.touches[0].clientY);
    lastTime = Date.now();
  }

  function handleTouchMove(event) {
    lastTouch = new vec2D(event.touches[0].clientX, event.touches[0].clientY);
  }

  function handleTouchEnd(event) {
    if (disabled === true) return;
    lastTouch = lastTouch || touchStart;
    let swipeVector = vec2DSubtract(touchStart, lastTouch);
    let eventName = "";
    let timeDiff = Date.now() - lastTime;
    if (swipeVector.mag() < threshold || timeDiff > timeout) return;
    if (Math.abs(swipeVector.x) > Math.abs(swipeVector.y)) {
      eventName = swipeVector.x < 0 ? "swipeRight" : "swipeLeft";
    } else {
      eventName = swipeVector.y < 0 ? "swipeDown" : "swipeUp";
    }

    if (typeof eventHandlers[eventName] === "function") {
      eventHandlers[eventName](touchStart, lastTouch);
    }
  }
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchend", handleTouchEnd);
  return {
    addEventListener: function (event, handler) {
      eventHandlers[event] = handler;
    },
    setSwipeThreshold: function (value) {
      threshold = value > 0 ? value : 50;
    },
    setSwipeTimeout: function (value) {
      timeout = value > 0 ? value : 500;
    },
    disable: function () {
      disabled = true;
    },
    enable: function () {
      disabled = false;
    },
  };
})();

// The main snake class
class Snake {
  constructor() {
    this.x = Math.round(Math.random() * (canvas.width / scl)) * scl;
    this.y = Math.round(Math.random() * (canvas.height / scl)) * scl;

    this.velocityX = scl;
    this.velocityY = 0;

    this.fullSnake = [];
    this.tail = 0;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x + 1, this.y + 1, scl - 2, scl - 2);
  }

  dir(velX, velY) {
    if (velX != this.velocityX && velY != this.velocityY) {
      this.velocityX = velX;
      this.velocityY = velY;
    }
  }

  eatFood(food) {
    if (this.x == food.x && this.y == food.y) {
      for (let i = this.tail; i > 0; i--) {
        this.fullSnake[i] = this.fullSnake[i - 1];
      }

      this.fullSnake[0] = {
        x: this.x,
        y: this.y,
      };

      this.tail++;
      score.innerHTML = this.tail;
      if (threshold > 80) threshold -= 0.5;

      newFood();
      drawFood(apple);
    }
  }

  death() {
    for (let i = 0; i < this.tail; i++) {
      let spot = this.fullSnake[i];
      let d = dist(this.x, spot.x, this.y, spot.y);
      if (d < 1) {
        if (this.tail > highScore) {
          highScore = this.tail;
          high.textContent = highScore;
        }

        this.fullSnake = [];
        this.tail = 0;
        alert("Game Over");
        running = false;
        gameContinued = false;
        document.querySelector("#pause-btn").classList.toggle("paused");
        score.innerHTML = 0;
        clearCanvas();
        return;
      }
    }
  }

  update() {
    clearCanvas();

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.death();
    this.eatFood(apple);
    drawFood(apple);

    for (let i = 0; i < this.tail; i++) {
      ctx.fillStyle = "white";
      ctx.fillRect(
        this.fullSnake[i].x + 1,
        this.fullSnake[i].y + 1,
        scl - 2,
        scl - 2
      );
      this.fullSnake[i] = this.fullSnake[i + 1];
    }

    if (this.x >= canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width - scl;
    if (this.y >= canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;

    this.fullSnake[this.fullSnake.length - 1] = {
      x: this.x,
      y: this.y,
    };

    if (gameContinued == false) {
      gameContinued = true;
    }

    this.draw();
  }
}

// All depended functions lie here
function newFood() {
  let appleX = randPoint(canvas.width);
  let appleY = randPoint(canvas.height);

  for (let i = 0; i < mySnake.tail; ) {
    let block = mySnake.fullSnake[i];

    if (block.x == appleX && block.y == apple.Y) {
      appleX = randPoint(canvas.width);
      appleY = randPoint(canvas.height);
      i = -1;
    } else i++;
  }

  if (mySnake.x == appleX && mySnake.y == appleY) {
    appleX = randPoint(canvas.width);
    appleY = randPoint(canvas.height);
  }

  apple = {
    x: appleX,
    y: appleY,
  };
}

function keyPressed(event) {
  const key = event.keyCode;
  switch (key) {
    case 65:
    case 37:
      mySnake.dir(-scl, 0);
      break;
    case 87:
    case 38:
      mySnake.dir(0, -scl);
      break;
    case 68:
    case 39:
      mySnake.dir(scl, 0);
      break;
    case 83:
    case 40:
      mySnake.dir(0, scl);
      break;
    case 32:
      pauseGame();
      break;
  }
}

function update() {
  let now = Date.now();

  if (now - prevTime > threshold) {
    mySnake.update();
    prevTime = now;
  }

  if (running) window.requestAnimationFrame(update);
}

function resize() {
  let gameHeader = document.querySelector("#game-head");
  canvas.width = Math.floor(window.innerWidth / scl) * scl;
  canvas.height =
    Math.floor(
      (window.innerHeight - gameHeader.getBoundingClientRect().height) / scl
    ) * scl;
}

const pauseGame = () => {
  if (running) {
    window.cancelAnimationFrame(raf);
  } else {
    raf = window.requestAnimationFrame(update);
    prevTime = Date.now();
  }
  running = !running;
  pauseBtn.classList.toggle("paused");
};

function draw() {
  score = document.querySelector("#scoreNum");
  high = document.querySelector("#highScore");
  score.innerHTML = "0";

  let gameHeader = document.querySelector("#game-head");

  canvas.width = Math.floor(window.innerWidth / scl) * scl;
  canvas.height =
    Math.floor(
      (window.innerHeight - gameHeader.getBoundingClientRect().height) / scl
    ) * scl;
  canvas.style.background = "#272b2f";

  mySnake = new Snake();
  newFood();
  drawFood(apple);
  mySnake.draw();
  gameContinued = true;

  // mySnake.update();

  document.body.addEventListener("keydown", keyPressed);

  pauseBtn = document.querySelector("#pause-btn");
  pauseBtn.addEventListener("click", pauseGame);

  // Added swipe detection
  SwipeDetector.addEventListener("swipeLeft", function () {
    mySnake.dir(-scl, 0);
  });

  SwipeDetector.addEventListener("swipeRight", function () {
    mySnake.dir(scl, 0);
  });

  SwipeDetector.addEventListener("swipeUp", function () {
    mySnake.dir(0, -scl);
  });

  SwipeDetector.addEventListener("swipeDown", function () {
    mySnake.dir(0, scl);
  });
}

window.onload = function () {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  // For the play button
  const playBtn = document.querySelector("#play");
  playBtn.addEventListener("click", function () {
    const active = document.querySelector(".active");
    active.classList.remove("active");
    document.querySelector("#game").classList.add("active");
    if (!gameContinued) draw();
    resize();
  });

  // For how to play
  const howToBtn = document.querySelector("#howto");
  howToBtn.addEventListener("click", function () {
    const active = document.querySelector(".active");
    active.classList.remove("active");
    document.querySelector("#howtoplay").classList.add("active");
  });

  // Back button
  document.querySelectorAll(".back").forEach((b) => {
    b.addEventListener("click", function () {
      if (b.classList.contains("playToHome") && running) {
        pauseGame();
      }

      const active = document.querySelector(".active");
      active.classList.remove("active");
      document.querySelector("#home").classList.add("active");
    });
  });
};

window.onresize = resize;
