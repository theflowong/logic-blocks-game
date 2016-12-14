var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

const SCALE = 16; // const: constant; do not update/change scale

/* ---------------
-----World object (for grid)
--------------- */
function World(w, h) {
  this.width = w;
  this.height = h;

  // initialize 2d array of objects
  this.grid = [];
  for (var i = 0; i < w; i++) {
    this.grid[i] = [];
    for (var j = 0; j < h; j++) {
      this.grid[i][j] = null;
    }
  }




}

/* ----------
-----Wall-----
---------- */
function Wall() {
}

Wall.prototype.draw = function(ctx, x, y) {
  // define functions inside prototype (only creates one instance of function)
  // ctx is a global variable
  ctx.fillStyle = "rgb(0,0, " + Math.floor(Math.random()*200) + ")";
  ctx.fillRect(x, y, SCALE, SCALE);
}





function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);



  // random drawing testing
  ctx.fillStyle = "rgb(" + Math.floor(Math.random()*200) + ",0,0)";
  ctx.fillRect(0, 0, 10, Math.random()*50);

  window.requestAnimationFrame(drawGame);
}

window.requestAnimationFrame(drawGame);
