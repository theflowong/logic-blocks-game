var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // random drawing testing
  ctx.fillStyle = "rgb(" + Math.floor(Math.random()*200) + ",0,0)";
  ctx.fillRect(0, 0, 10, Math.random()*50);

  window.requestAnimationFrame(drawGame);
}

window.requestAnimationFrame(drawGame);
