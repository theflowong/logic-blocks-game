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

  // set up goomba walls

  // set up player interaction
  this.grid[4][5] = new Player();

  // set up start and finish



}

// check event inputs, see if player can move
// accepts x, y
World.prototype.turn = function(input) {
  copy = [] // make copy of this.grid
  for (var i = 0; i < this.width; i++) {
    copy[i] = [];
    for (var j = 0; j < this.height; j++) {
      copy[i][j] = this.grid[i][j];
    }
  }
  for (var i = 0; i < this.width; i++) {
    for (var j = 0; j < this.height; j++) {
      if (copy[i][j] && copy[i][j].turn) { // check that there exists a turn
        copy[i][j].turn(this, i, j, input);
      }
    }
  }
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
World.prototype.swap = function(oldx, oldy, newx, newy) {
  var item1 = this.grid[oldx][oldy];
  var item2 = this.grid[newx][newy];
  this.grid[oldx][oldy] = item2;
  this.grid[newx][newy] = item1;
}
World.prototype.isEmpty = function(x, y) {
  return (this.grid[x][y] === null);
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
---------------Player---------------
------------------------------ */
function Player() {
}

Player.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = "rgb(200,120,0)";
  ctx.fillRect(x, y, SCALE, SCALE);
}

Player.prototype.turn = function(world, x, y, input) { // input is keyCode

  var newx = x;
  var newy = y;

  switch (input) {
    case 37: // left
      newx--;
    break;

    case 38: // up
      newy--;
    break;

    case 39: // right
      newx++;
    break;

    case 40: // down
      newy++;
    break;
  }
  if (world.isEmpty(newx, newy)) {
    world.swap(x, y, newx, newy);
  }
}



/* ------------------------------
---------------Game---------------
------------------------------ */

// get input (key code)
window.addEventListener('keydown', function(event) {
  world.turn(event.keyCode);
})


// draw game
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  world.draw(ctx);

  window.requestAnimationFrame(drawGame);
}

window.requestAnimationFrame(drawGame);
