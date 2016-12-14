var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var world = new World(50, 50);
const SCALE = 16; // const: constant; do not update/change scale

/* ------------------------------
-----World object (for grid)-----
------------------------------ */
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

  // set up walls
  this.grid[5][10] = new Wall();


  // set up player interaction

  // set up start and finish



}

World.prototype.draw = function(ctx) {
  for (var i = 0; i < this.width; i++) {
    for (var j = 0; j < this.height; j++) {
      if (this.grid[i][j]) { // check to see if square is not null
        this.grid[i][j].draw(ctx, i*SCALE, j*SCALE);
      }
    }
  }
}

/* ------------------------------
---------------Wall---------------
------------------------------ */
function Wall() {
}

Wall.prototype.draw = function(ctx, x, y) {
  // define functions inside prototype (only creates one instance of function)
  // ctx is a global variable
  ctx.fillStyle = "rgb(0,0, " + Math.floor(Math.random()*200) + ")";
  ctx.fillRect(x, y, SCALE, SCALE);
}




/* ------------------------------
---------------Game---------------
------------------------------ */
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  world.draw(ctx);

  window.requestAnimationFrame(drawGame);
}

window.requestAnimationFrame(drawGame);
