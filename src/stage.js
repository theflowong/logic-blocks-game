const C = require('./constants');
var Wall = require('./wall');
var Block = require('./block');
var BlackHole = require('./blackhole');
var Rando = require('./rando');
var Finish = require('./finish');
var Player = require('./player');
var randInt = require('./functions').randInt;
var adj = require('./functions').adj;

// *Question. SHOULD THIS BE GLOBAL?
// used to be function of World.prototype, and called through nextStage.
// but need this to initialize stage?
function updateInstructions(stage_name, instr) {
  document.getElementById('stage-name').innerHTML = stage_name;
  document.getElementById('instructions').innerHTML = instr;
}

function generateWalls(w, h) {
  var grid = [];
  for (var i = 0; i < w; i++) {
    grid[i] = [];
    for (var j = 0; j < h; j++) {
      // if they're not at the edge of board
      if ((i !== 0) && (i !== w-1) && (j !== 0) && (j !== h-1)) {
        // experimenting with where to put Block walls
        if (randInt(0,3) === 0) {
          grid[i][j] = new Block();
        }
        else {
          grid[i][j] = new Wall();
        }
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
          if (randInt(0, 7) !== 0) { // for random walls within room
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

  // generate Block blocks IN rooms
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      if (randInt(0, 6) === 0 && grid[i][j] === null) {
        grid[i][j] = new Block();
      }
    }
  }

  return grid;
}
function generateBlackHoles(grid, w, h) { // randomized locations
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      if (randInt(0, 20) === 0 && grid[i][j] === null) {
        grid[i][j] = new BlackHole(C.blackhole_cap);
      }
    }
  }
  return grid;
}
function generateRandos(grid, w, h) { // randomized locations
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      if (randInt(0, 20) === 0 && grid[i][j] === null) {
        grid[i][j] = new Rando();
      }
    }
  }
  return grid;
}

function Stage(w, h, world, stage_config) {
  // consider refactoring to limit parameters?
  this.width = w;
  this.height = h;
  this.world = world;

  this.title = stage_config['title'];
  this.instr = stage_config['instr'];

  this.has_rando = stage_config['has_rando'];
  this.has_finish = stage_config['has_finish'];

  // update instructions to world/GLOBAL?
  updateInstructions(this.title, this.instr);

  // initialize 2d array of objects
  this.grid = generateWalls(w, h);
  this.grid = generateBlackHoles(this.grid, w, h);

  if (this.has_rando) {
    this.grid = generateRandos(this.grid, w, h);
  }

  // set up start and finish
  if (this.has_finish) {
    this.grid[randInt(1, w-1)][0] = new Finish(); // top
    this.grid[randInt(1, w-1)][h-1] = new Finish(); // bottom
  }

  // set up player (start in center? maybe random?)
  this.grid[randInt(1,w-1)][randInt(1,h-1)] = new Player();
  //this.grid[Math.floor(w/4)][Math.floor(h/4)] = new Player(); // center
}

Stage.prototype.turn = function(world, input) {
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
        copy[i][j].turn(this, i, j, world, input);
      }
    }
  }
}
Stage.prototype.draw = function(ctx) {
  ctx.fillStyle = C.stage_col;
  ctx.fillRect(0, 0, this.width * C.SCALE, this.height * C.SCALE);
  for (var i = 0; i < this.width; i++) {
    for (var j = 0; j < this.height; j++) {
      if (this.grid[i][j]) { // check to see if square is not null
        this.grid[i][j].draw(ctx, i*C.SCALE, j*C.SCALE);
      }
    }
  }
}
Stage.prototype.swap = function(oldx, oldy, newx, newy) {
  var item1 = this.grid[oldx][oldy];
  var item2 = this.grid[newx][newy];
  this.grid[oldx][oldy] = item2;
  this.grid[newx][newy] = item1;
}
Stage.prototype.isEmpty = function(x, y) {
  return (this.grid[x][y] === null);
}
Stage.prototype.isObject = function(x, y, obj) {
  return (this.grid[x][y] instanceof obj);
}
Stage.prototype.winMessage = function(str) {
  // THINK more about how this is set up
  var world = this.world;
  setTimeout(function() {
    world.nextStage(); // move on to next level
    alert(str);
  }, 300);
  // track any points/progress/endgame
  // restart game or go to next level?
  // reset screen?
}

module.exports = Stage;
