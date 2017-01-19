// Things to check, marked with: *Question.
// Things to do, marked with: *DO LATER:

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

const SCALE = 18; // const: constant; do not update/change scale
var world = new World();

/* --------------------- COLORS -------------------- */
var stage_col = 'rgba(239, 244, 240, 1)'; // anti-flash white //"rgb(237,237,237)"; // background, off-white
var wall_col = "rgba(155, 193, 188, 1)"; // cambridge blue //'rgba(227, 206, 205, 1)'; // dust storm
var finish_col = stage_col; 'rgba(28, 40, 59, 1)'; // yankees blue
var goomba_col = 'rgba(175, 219, 232, 1)'; // light blue //"rgb(190,170,190)"; // purple
var rando_col = "rgb(80, 180, 180)"; // teal
// var blackhole_col = "rgb(85,85,85)";
// blackhole_col now local variable (transparency depends on goombas)
var blackhole_cap = 4;
var player_col = 'rgba(235, 211, 176, 1)'; // desert sand //"rgb(200,120,0)"; // orange

function randInt(low, high) {
  // returns a random integer between two given integers
  // (not including high number)
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

/* --------------------------------------------------
-------------------------Worlds-------------------------
-------------------------------------------------- */
function World() {
  this.stage_config = [
    // {instructions: 'instructions here', has_rando: true, has_finish: true, other_info: false},
    {
      title: 'Escape to Finish',
      instr: 'Escape the board! Hint: look at the border.',
      has_rando: false,
      has_finish: true
    },
    {
      title: 'Push Goombas into BlackHoles',
      instr: 'Vanish a BlackHole. Hint: try some pushing some stuff into each other.',
      has_rando: false,
      has_finish: false
    },
    {
      title: 'Trap Randos',
      instr: "Trap the randomly moving creatures in a specific area that isn't implemented yet, therefore is impossible to complete.",
      has_rando: true,
      has_finish: false
    }
  ];
  this.stage_count = 0;
  this.stage = new Stage(canvas.width/SCALE, canvas.height/SCALE, this, this.stage_config[this.stage_count]);
}
World.prototype.turn = function(input) {
  this.stage.turn(input);
}
World.prototype.draw = function(ctx) {
  this.stage.draw(ctx);
}
World.prototype.resetStage = function() {
  // *Question. Should resetStage function be in World? i think so, but check when not sleep deprived hehhe.
  this.stage = new Stage(canvas.width/SCALE, canvas.height/SCALE, this, this.stage_config[this.stage_count]);
}
World.prototype.nextStage = function() {
  this.stage_count++;
  var stg_config = this.stage_config[this.stage_count];
  this.stage = new Stage(canvas.width/SCALE, canvas.height/SCALE, this, stg_config);
  // *DO LATER: possibly replace ^above with resetStage function? for efficiency. experiment more.
}

// *Question. SHOULD THIS BE GLOBAL?
// used to be function of World.prototype, and called through nextStage.
// but need this to initialize stage?
function updateInstructions(stage_name, instr) {
  document.getElementById('stage-name').innerHTML = stage_name;
  document.getElementById('instructions').innerHTML = instr;
}

/* --------------------------------------------------
---------------Stage object (for grid)---------------
-------------------------------------------------- */
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
    this.grid[w-2][h-1] = new Finish();
  }

  // set up player (start in center? maybe random?)
  this.grid[Math.floor(w/4)][Math.floor(h/4)] = new Player();

  // for testing purposes: easy access to finish
  //this.grid[w-2][h-2] = new Player();
}

function generateWalls(w, h) {
  var grid = [];
  for (var i = 0; i < w; i++) {
    grid[i] = [];
    for (var j = 0; j < h; j++) {
      // if they're not at the edge of board
      if ((i !== 0) && (i !== w-1) && (j !== 0) && (j !== h-1)) {
        // experimenting with where to put Goomba walls
        if (randInt(0,3) === 0) {
          grid[i][j] = new Goomba();
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

  // generate Goomba blocks IN rooms
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      if (randInt(0, 6) === 0 && grid[i][j] === null) {
        grid[i][j] = new Goomba();
      }
    }
  }

  return grid;
}
function generateBlackHoles(grid, w, h) { // randomized locations
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      if (randInt(0, 20) === 0 && grid[i][j] === null) {
        grid[i][j] = new BlackHole(blackhole_cap);
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
// check event inputs, see if player can move
// accepts x, y
Stage.prototype.turn = function(input) {
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
Stage.prototype.draw = function(ctx) {
  ctx.fillStyle = stage_col;
  ctx.fillRect(0, 0, this.width * SCALE, this.height * SCALE);
  for (var i = 0; i < this.width; i++) {
    for (var j = 0; j < this.height; j++) {
      if (this.grid[i][j]) { // check to see if square is not null
        this.grid[i][j].draw(ctx, i*SCALE, j*SCALE);
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
  console.log('this.world', this.world, world);
  setTimeout(function() {
    world.nextStage(); // move on to next level
    alert(str);
  }, 300);
  // track any points/progress/endgame
  // restart game or go to next level?
  // reset screen?
}

/* --------------------------------------------------
-------------------------Wall-------------------------
-------------------------------------------------- */
function Wall() {
}
Wall.prototype.draw = function(ctx, x, y) {
  // define functions inside prototype (only creates one instance of function)
  // ctx is a global variable
  ctx.fillStyle = wall_col;
  ctx.fillRect(x, y, SCALE, SCALE);
}

/* --------------------------------------------------
--------------------Goomba Wall--------------------
-------------------------------------------------- */
function Goomba() {
}
// same as wall... possible extension?
Goomba.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = goomba_col;
  ctx.fillRect(x, y, SCALE, SCALE);
}

/* --------------------------------------------------
--------------------Black Holes--------------------
-------------------------------------------------- */
function BlackHole(capacity) {
  this.count = 0;
  this.cap = capacity;
  this.trans = 1;
  this.color = "rgba(85,85,85,1)";
}
BlackHole.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = this.color;
  ctx.fillRect(x, y, SCALE, SCALE);
}

/* ------------------------------------------------------------
----------Rando creatures (move randomly each turn)----------
------------------------------------------------------------ */
function Rando() {
}
Rando.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = rando_col;
  ctx.fillRect(x, y, SCALE, SCALE);
}
Rando.prototype.turn = function(stage, x, y, input) {
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

  if (stage.isEmpty(newx, newy)) {
    stage.swap(x, y, newx, newy);
  }
}

/* --------------------------------------------------
--------------------Finish Square--------------------
-------------------------------------------------- */
function Finish() {
}
Finish.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = finish_col;
  ctx.fillRect(x, y, SCALE, SCALE);
}

/* --------------------------------------------------
-------------------------Player-------------------------
-------------------------------------------------- */
function Player() {
}

Player.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = player_col;
  ctx.fillRect(x, y, SCALE, SCALE);
}
Player.prototype.turn = function(stage, x, y, input) { // input is keyCode

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
  if (stage.isEmpty(newx, newy)) {
    stage.swap(x, y, newx, newy);
  }
  else if (stage.isObject(newx, newy, Goomba)) {
    if ((gx >= 0) && (gx <= (canvas.width-1))) {
      if (stage.isEmpty(gx, gy)) {
        stage.swap(newx, newy, gx, gy);
        stage.swap(x, y, newx, newy);
      }
    }
    if (stage.isObject(gx, gy, BlackHole)) {
      var hole = stage.grid[gx][gy];
      hole.count++;
      stage.grid[newx][newy] = null;
      stage.swap(x, y, newx, newy);

      var count = hole.count;
      var cap = hole.cap;
      console.log('cap', hole.cap);
      var trans = hole.trans;
      console.log('trans', hole.trans);

      // make holes disappear gradually when you push enough goombas in it
      trans = (cap-count)/cap;
      hole.color = "rgba(85,85,85," + trans.toString() + ")";

      if (count === cap) {
        stage.grid[gx][gy] = null;
        if (world.stage_count === 1) {
          stage.winMessage("Nice, you've disposed of some Goombas in a selfish pursuit for your own space. On to the next stage!");
        }
      }
    }
  }
  else if (stage.isObject(newx, newy, Finish)) {
    stage.grid[newx][newy] = null;
    stage.swap(x, y, newx, newy);
    // temporary "winning" message
    stage.winMessage("Congrats! You've reached the finish.");
  }
}

/* --------------------- RESET STAGE -------------------- */

var reset_button = document.getElementById('reset-stage');
reset_button.onclick = function() {
  world.resetStage();
};

// *Question. Use above instead of eventListener?
/*
if (reset_button.addEventListener) {
  console.log('click');
  reset_button.addEventListener('click', world.resetStage(), false);
}
else if (reset_button.attachEvent) {
  reset_button.attachEvent('onlick', world.resetStage());
}
*/

/* --------------------------------------------------
-------------------------Game-------------------------
-------------------------------------------------- */

// *Question. this whole StartMainMenu design

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


/*
function StartGame() {
  window.requestAnimationFrame(drawGame);
}

function StartMainMenu(ctx) {
  // background
  ctx.fillStyle = 'rgb(100,100,0)';//stage_col;
  ctx.fillRect(0,0, canvas.width, canvas.height);

  // text
  ctx.fillStyle = 'rgb(10,10,10)';
  ctx.font = "60px Clear Sans Arial";
  ctx.textAlign = 'center';
  ctx.strokeText('Start Game', canvas.width/2, canvas.height/2);

  window.addEventListener('click', function(event) {
    StartGame();
  })
}

StartMainMenu(ctx);

*/

window.requestAnimationFrame(drawGame);
