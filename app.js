let canvas;
let ctx;
let scl = 20;
let raf;
let mySnake;
let running = false;
let apple;
let frames = 0;

class Snake {
  constructor() {
    this.x = Math.round(Math.random() * (canvas.width / scl)) * scl;
    this.y = Math.round(Math.random() * (canvas.height / scl)) * scl;

    this.velocityX = scl;
    this.velocityY = 0;
    this.tail = 0;

    this.fullSnake = [];
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, scl, scl);
  }

  dir(velX, velY) {
    if (velX != this.velocityX && velY != this.velocityY) {
      this.velocityX = velX;
      this.velocityY = velY;
    } else {
      console.log("Same ");
    }
  }

  eatFood(food) {
    if (this.x == food.x && this.y == food.y) {
      this.tail++;
      // console.log(this.tail);

      this.fullSnake.push({
        x: this.x,
        y: this.y,
      });

      newFood();
      drawFood(apple);
    }
  }

  update() {
    clearCanvas();
    for (let i = 0; i < this.tail; i++) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.fullSnake[i].x, this.fullSnake[i].y, scl, scl);

      this.fullSnake[i] = this.fullSnake[i + 1];

      if (this.x == this.fullSnake[i].x && this.y == this.fullSnake[i].y) {
        alert("Game Over");
        this.tail = 0;
        this.fullSnake = [];
        window.cancelAnimationFrame(raf);
        return;
      }
    }
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x >= canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width - scl;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;

    this.fullSnake[this.tail - 1] = {
      x: this.x,
      y: this.y,
    };

    this.eatFood(apple);
    drawFood(apple);

    this.draw();
  }
}

function drawFood(food) {
  ctx.fillStyle = "#ff4e0b";
  ctx.fillRect(food.x, food.y, scl, scl);
}

function randPoint(size) {
  return Math.round(Math.random() * (size / scl - 1)) * scl;
}

function newFood() {
  let appleX = randPoint(canvas.width);
  let appleY = randPoint(canvas.height);

  for (let i = 0; i < mySnake.tail; ) {
    let block = mySnake.fullSnake[i];

    if (block.x == appleX && block.y == apple.Y) {
      appleX = randPoint(canvas.width);
      appleY = randPoint(canvas.height);
      i = -1;
      console.log("Tail");
    } else if (mySnake.x == appleX && mySnake.y == appleY) {
      appleX = randPoint(canvas.width);
      appleY = randPoint(canvas.height);
      i = -1;
      console.log("Head");
    }

    i++;
  }

  apple = {
    x: appleX,
    y: appleY,
  };
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  if (frames >= 20) {
    mySnake.update();
    frames = 0;
  }

  if (running) window.requestAnimationFrame(update);
}

function clicked() {
  clearCanvas();
  mySnake.fullSnake.push({
    x: mySnake.x,
    y: mySnake.y,
  });
  // mySnake.update();
}

function draw() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = 660;
  canvas.height = 500;
  canvas.style.background = "#515151";
  ctx.lineWidth = 2;

  mySnake = new Snake();
  newFood();
  drawFood(apple);
  mySnake.draw();

  document.body.addEventListener("keydown", keyPressed);
  document.body.addEventListener("click", clicked);
}

window.onload = draw;
