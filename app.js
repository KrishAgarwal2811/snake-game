let canvas;
let ctx;
let scl = 20;
let raf;
let mySnake;
let running = false;
let apple;
let frames = 0;

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
    ctx.strokeStyle = "#616161";
    ctx.strokeRect(this.x, this.y, scl, scl);
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

      newFood();
      drawFood(apple);
    }
  }

  death() {
    for (let i = 0; i < this.tail; i++) {
      let spot = this.fullSnake[i];
      let d = dist(this.x, spot.x, this.y, spot.y);
      if (d < 1) {
        this.fullSnake = [];
        this.tail = 0;
        alert("Game Over");
        running = false;
        clearCanvas();
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
      ctx.strokeStyle = "#616161";
      ctx.strokeRect(this.fullSnake[i].x, this.fullSnake[i].y, scl, scl);
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

    this.draw();
  }
}

// All depended functions lie here
function newFood() {
  let appleX = randPoint(canvas.width);
  let appleY = randPoint(canvas.height);

  for (let i = 0; i < mySnake.tail; i++) {
    let block = mySnake.fullSnake[i];

    if (block.x == appleX && block.y == apple.Y) {
      appleX = randPoint(canvas.width);
      appleY = randPoint(canvas.height);
      i = -1;
    }
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
    case 37:
      mySnake.dir(-scl, 0);
      break;
    case 38:
      mySnake.dir(0, -scl);
      break;
    case 39:
      mySnake.dir(scl, 0);
      break;
    case 40:
      mySnake.dir(0, scl);
      break;
    case 32:
      if (running) {
        window.cancelAnimationFrame(raf);
      } else {
        raf = window.requestAnimationFrame(update);
      }
      running = !running;
      break;
  }
}

function update() {
  frames++;

  if (frames >= 10) {
    mySnake.update();
    frames = 0;
  }

  if (running) window.requestAnimationFrame(update);
}

function clicked() {
  clearCanvas();
  mySnake.eatFood({ x: mySnake.x, y: mySnake.y });
  mySnake.update();
}

function draw() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = Math.floor(window.innerWidth / scl) * scl;
  canvas.height =
    Math.floor(
      (window.innerHeight - document.querySelector("#controls").offsetHeight) /
        scl
    ) * scl;
  canvas.style.background = "#515151";

  mySnake = new Snake();
  newFood();
  drawFood(apple);
  mySnake.draw();

  document.body.addEventListener("keydown", keyPressed);

  document.querySelectorAll("#controls button").forEach((button) => {
    button.addEventListener("click", () => {
      keyPressed({ keyCode: parseInt(button.getAttribute("data-keyCode")) });
    });
  });
}

window.onload = draw;
window.onresize = draw;
