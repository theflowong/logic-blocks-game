var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var world = new World(50, 50);
const SCALE = 16; // const: constant; do not update/change scale

// returns a random integer between two given integers
function randInt(low, high) {
  return Math.floor(Math.random()*(high-low)+low);
}

/* ------------------------------
-----World object (for grid)-----
------------------------------ */
function World(w, h) {
  this.width = w;
  this.height = h;

  // initialize 2d array of objects
  this.grid = generateWalls(w, h);

  // set up goomba walls
  this.grid[5][5] = new Goomba();

  // set up player interaction
  this.grid[4][5] = new Player();

  // set up start and finish
}

// finds adjacent tiles to x and y
function adj(x, y, w, h) {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter(function(pos) { // filters for tiles that are contained in the grid
    return pos[0] >= 0 && pos[0] < w && pos[1] >= 0 && pos[1] < h;
  });
}

function generateWalls(w, h) {
  var grid = [];
  for (var i = 0; i < w; i++) {
    grid[i] = [];
    for (var j = 0; j < h; j++) {
      grid[i][j] = new Wall();
    }
  }

  const SIZE = 7;
  const room_count_w = Math.floor(w / SIZE);
  const room_count_h = Math.floor(h / SIZE);
  for (var roomY = 0; roomY < room_count_h; roomY++) {
    // guarantee at least one room in each row has a hole up
    var bottomHole = randInt(0, room_count_w);
    for (var roomX = 0; roomX < room_count_w; roomX++) {
      if (roomX !== 0) {
        grid[roomX*SIZE][randInt(roomY*SIZE+1, roomY*SIZE + SIZE)] = null;
      }
      // if room is either guaranteed hole up, or if some small chance, punch a hole upward
      if (roomY !== 0 && (bottomHole === roomX || randInt(0, 8) === 0)) {
        grid[randInt(roomX*SIZE+1, roomX*SIZE + SIZE)][roomY*SIZE] = null;
      }
      for (var holeX = roomX*SIZE + 1; holeX < roomX*SIZE + SIZE; holeX++) {
        for (var holeY = roomY*SIZE + 1; holeY < roomY*SIZE + SIZE; holeY++) {
          grid[holeX][holeY] = null;
        }
      }
    }
  }

  return grid;
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
  ctx.fillStyle = "rgb(237,237,237)";
  ctx.fillRect(0, 0, this.width * SCALE, this.height * SCALE);
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
  ctx.fillStyle = "rgb(100,150,100)";
  ctx.fillRect(x, y, SCALE, SCALE);
}

/* ------------------------------
----------Goomba Wall----------
------------------------------ */
function Goomba() {
}

// same as wall... possible extension?
Goomba.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = "rgb(130,120,140)";
  ctx.fillRect(x, y, SCALE, SCALE);
}

/*Goomba.prototype.turn = function(world, x, y, input) {
  if (world.isEmpty(newx, newy)) {
    world.swap(x, y, newx, newy);
  }
}*/

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
