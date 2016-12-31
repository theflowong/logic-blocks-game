var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

const SCALE = 16; // const: constant; do not update/change scale
var world = new World(canvas.width/SCALE, canvas.height/SCALE);

// returns a random integer between two given integers
// (not including high number)
function randInt(low, high) {
  return Math.floor(Math.random()*(high-low)+low);
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

/* ------------------------------
-----World object (for grid)-----
------------------------------ */
function World(w, h) {
  this.width = w;
  this.height = h;

  // initialize 2d array of objects
  this.grid = generateWalls(w, h);

  // test Rando
  this.grid[3][3] = new Rando();

  // set up player (start in center)
  //this.grid[Math.floor(w/2)][Math.floor(h/2)] = new Player();
  this.grid[w-2][h-2] = new Player();

  // set up start and finish
  this.grid[w-2][h-1] = new Finish();
}

function generateWalls(w, h) {
  var grid = [];
  for (var i = 0; i < w; i++) {
    grid[i] = [];
    for (var j = 0; j < h; j++) {
      // experimenting with where to put Goomba walls
      if (randInt(0,3) === 0) {
        grid[i][j] = new Goomba();
      }
      else {
        grid[i][j] = new Wall();
      }
    }
  }

  const SIZE = 7; // size of room
  const room_count_w = Math.floor(w / SIZE);
  const room_count_h = Math.floor(h / SIZE);
  for (var roomY = 0; roomY < room_count_h; roomY++) {
    // guarantee at least one room in each row has a hole up
    var bottomHole = randInt(0, room_count_w);
    for (var roomX = 0; roomX < room_count_w; roomX++) {

      // generate room by punching large holes out
      for (var holeX = roomX*SIZE + 1; holeX < roomX*SIZE + SIZE; holeX++) {
        for (var holeY = roomY*SIZE + 1; holeY < roomY*SIZE + SIZE; holeY++) {
          if (randInt(0, 8) !== 0) { // for random walls within room
            grid[holeX][holeY] = null;
          }
        }
      }
      // punch holes in vertical walls
      if (roomX !== 0) {
        grid[roomX*SIZE][randInt(roomY*SIZE+1, roomY*SIZE + SIZE)] = null;
      }
      // if room is either guaranteed hole up, or if some small chance, punch a hole upward in horizontal wall
      if (roomY !== 0 && (bottomHole === roomX || randInt(0, 8) === 0)) {
        grid[randInt(roomX*SIZE+1, roomX*SIZE + SIZE)][roomY*SIZE] = null;
      }
    }
  }

  // generate Goomba blocks IN rooms
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      if (randInt(0, 5) === 0 && grid[i][j] === null) {
        grid[i][j] = new Goomba();
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
  ctx.fillStyle = "rgb(237,237,237)"; // background
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
World.prototype.isGoomba = function(x, y) {
  return (this.grid[x][y] instanceof Goomba);
}
World.prototype.isFinish = function(x, y) {
  return (this.grid[x][y] instanceof Finish);
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
  ctx.fillStyle = "rgb(190,170,190)"; // purple
  ctx.fillRect(x, y, SCALE, SCALE);
}

/* ------------------------------------------------------------
----------Rando creatures (move randomly each turn)----------
------------------------------------------------------------ */
function Rando() {
}
Rando.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = "rgb(80, 80, 80)";
  ctx.fillRect(x, y, SCALE, SCALE);
}
Rando.prototype.turn = function(world, x, y, input) {
  var newx = x;
  var newy = y;

  var upordown = (randInt(0,2) === 0); // true: up, false: down
  var xory = (randInt(0,2) === 0); // true: x, false: y

  // note:
  // switch statements dispatch immediately to cases (via indexed jump, with jump tables)
  // if-else evaluate all conditions (hence is slower)
  switch (xory) {
    case true:
      switch (upordown) {
        case true:
          newx++;
          break;
        case false:
          newx--;
          break;
      }
      break;
    case false:
      switch (upordown) {
        case true:
          newy++;
          break;
        case false:
          newy--;
          break;
      }
      break;
  }

  if (world.isEmpty(newx, newy)) {
    world.swap(x, y, newx, newy);
  }
}

/* ------------------------------
----------Finish Square----------
------------------------------ */
function Finish() {
}
Finish.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = "rgb(50,50,100)";
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
  var gx = x;
  var gy = y;

  switch (input) {
    case 37: // left
      newx--;
      gx-=2;
    break;

    case 38: // up
      newy--;
      gy-=2;
    break;

    case 39: // right
      newx++;
      gx+=2;
    break;

    case 40: // down
      newy++;
      gy+=2;
    break;
  }
  if (world.isEmpty(newx, newy)) {
    world.swap(x, y, newx, newy);
  }
  else if (world.isGoomba(newx, newy)) {
    if (world.isEmpty(gx, gy)) {
      world.swap(newx, newy, gx, gy);
      world.swap(x, y, newx, newy);
    }
  }
  else if (world.isFinish(newx, newy)) {
    // add code here to have player "land" on finish square
    // temporary "winning" message
    alert("Congrats! You've reached the finish.");
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
