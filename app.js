function draw() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  ctx.lineWidth = 2;
}

window.onload = draw;
