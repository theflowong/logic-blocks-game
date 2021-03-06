/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Things to check, marked with: *Question.
	// Things to do, marked with: *DO LATER:

	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");

	const C = __webpack_require__(1);

	const Wall = __webpack_require__(2);
	const Block = __webpack_require__(3);
	const BlackHole = __webpack_require__(4);
	const Finish = __webpack_require__(5);

	const Player = __webpack_require__(6);
	const Stage = __webpack_require__(7);
	const World = __webpack_require__(10);


	var world = new World();


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


	/* --------------------- GAME -------------------- */

	// *Question. this whole StartMainMenu design

	// get input (key code)
	window.addEventListener('keydown', function(event) {
	  world.turn(event.keyCode);
	  event.preventDefault();
	})

	// draw game
	function drawGame() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  world.draw(ctx);
	  window.requestAnimationFrame(drawGame);
	}

	window.requestAnimationFrame(drawGame);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
	  SCALE: 18,
	  canvas: document.getElementById("game"),
	  ctx: document.getElementById("game").getContext("2d"),
	  blackhole_cap: 4,

	  stage_col: 'rgba(239, 244, 240, 1)', // anti-flash white //"rgb(237,237,237)"; // background, off-white
	  wall_col: "rgba(155, 193, 188, 1)",
	  block_col: 'rgba(175, 219, 232, 1)', // light blue //"rgb(190,170,190)"; // purple
	  rando_col: "rgb(80, 180, 180)", // teal
	  finish_col: 'rgba(239, 244, 240, 1)', // stage_col 'rgba(28, 40, 59, 1)', // yankees blue
	  player_col: 'rgba(235, 211, 176, 1)' // desert sand //"rgb(200,120,0)"; // orange
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__(1);

	function Wall() {
	}
	Wall.prototype.draw = function(ctx, x, y) {
	  // define functions inside prototype (only creates one instance of function)
	  // ctx is a global variable
	  ctx.fillStyle = C.wall_col; //"rgba(155, 193, 188, 1)"; //wall_col;
	  ctx.fillRect(x, y, C.SCALE, C.SCALE);
	}

	module.exports = Wall;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__(1);

	function Block() {
	}
	// same as wall... possible extension?
	Block.prototype.draw = function(ctx, x, y) {
	  ctx.fillStyle = C.block_col;
	  ctx.fillRect(x, y, C.SCALE, C.SCALE);
	}

	module.exports = Block;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__(1);

	function BlackHole(capacity) {
	  this.count = 0;
	  this.cap = capacity;
	  this.trans = 1;
	  this.color = "rgba(85,85,85,1)";
	}
	BlackHole.prototype.draw = function(ctx, x, y) {
	  ctx.fillStyle = this.color;
	  ctx.fillRect(x, y, C.SCALE, C.SCALE);
	}

	module.exports = BlackHole;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__(1);

	function Finish() {
	}
	Finish.prototype.draw = function(ctx, x, y) {
	  ctx.fillStyle = C.finish_col;
	  ctx.fillRect(x, y, C.SCALE, C.SCALE);
	}

	module.exports = Finish;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__(1);
	var Block = __webpack_require__(3);
	var BlackHole = __webpack_require__(4);
	var Finish = __webpack_require__(5);

	function Player() {
	}

	Player.prototype.draw = function(ctx, x, y) {
	  ctx.fillStyle = C.player_col;
	  ctx.fillRect(x, y, C.SCALE, C.SCALE);
	}
	Player.prototype.turn = function(stage, x, y, world, input) { // input is keyCode

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
	  else if (stage.isObject(newx, newy, Block)) {
	    if ((gx >= 0) && (gx <= (C.canvas.width-1))) {
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
	      var trans = hole.trans;

	      // make holes disappear gradually when you push enough goombas in it
	      trans = (cap-count)/cap;
	      hole.color = "rgba(85,85,85," + trans.toString() + ")";

	      if (count === cap) {
	        stage.grid[gx][gy] = null;
	        if (world.stage_count === 1) {
	          stage.winMessage("Nice! You're becoming a human actor, and modifying environments to suit your needs. Next Stage.");
	        }
	      }
	    }
	  }
	  else if (stage.isObject(newx, newy, Finish)) {
	    stage.grid[newx][newy] = null;
	    stage.swap(x, y, newx, newy);
	    // temporary "winning" message
	    stage.winMessage("Congrats! You've escaped the trappings of society. Now you have another society to worry about!");
	  }

	}

	module.exports = Player;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const C = __webpack_require__(1);
	var Wall = __webpack_require__(2);
	var Block = __webpack_require__(3);
	var BlackHole = __webpack_require__(4);
	var Rando = __webpack_require__(8);
	var Finish = __webpack_require__(5);
	var Player = __webpack_require__(6);
	var randInt = __webpack_require__(9).randInt;
	var adj = __webpack_require__(9).adj;

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
	    if (world.hasNextStage()) {
	      world.nextStage();
	    }
	    alert(str);
	  }, 300);
	  // track any points/progress/endgame
	  // restart game or go to next level?
	  // reset screen?
	}

	module.exports = Stage;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__(1);
	var stage = __webpack_require__(7);
	var randInt = __webpack_require__(9).randInt;
	var rando_count;

	function Rando() {
	}
	Rando.prototype.draw = function(ctx, x, y) {
	  ctx.fillStyle = C.rando_col;
	  ctx.fillRect(x, y, C.SCALE, C.SCALE);
	}
	Rando.prototype.turn = function(stage, x, y, world, input) {
	  var newx = x;
	  var newy = y;

	  var upordown = (randInt(0,2) === 0); // true: up, false: down
	  var xory = (randInt(0,2) === 0); // true: x, false: y

	  if (this.isTrapped(world, stage, x, y)) {
	    // *DO LATER: add some cool disappearing trick effect here?
	    stage.grid[x][y] = null;

	    if (world.stage_count === 2) {
	      rando_count = 0;
	      for (var i = 0; i < stage.width; i++) {
	        for (var j = 0; j < stage.height; j++) {

	          if (stage.isObject(i, j, Rando)) {
	            rando_count++;
	            console.log('there are still randos');
	          }
	          // *DO LATER: have some sort of winning stage measure here
	        }
	      }
	      if (rando_count === 0) {
	        stage.winMessage("No more creatures are left, so I guess you've won.");
	      }
	    }
	  }

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
	Rando.prototype.isTrapped = function(world, stage, x, y) {
	  return (!(stage.isEmpty(x+1, y)) && !(stage.isEmpty(x-1, y)) && !(stage.isEmpty(x, y-1)) && !(stage.isEmpty(x, y+1)));
	}
	module.exports = Rando;


/***/ },
/* 9 */
/***/ function(module, exports) {

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

	module.exports = {randInt, adj};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var C = __webpack_require__(1);
	var Stage = __webpack_require__(7);

	function World() {
	  this.stage_config = [
	    {
	      title: 'Escape to Finish',
	      instr: 'Escape the board! Hint: look at the border.',
	      has_rando: false,
	      has_finish: true
	    },
	    {
	      title: 'Push Blocks into BlackHoles',
	      instr: 'Vanish a BlackHole. Hint: try some pushing some stuff into each other.',
	      has_rando: false,
	      has_finish: false
	    },
	    {
	      title: 'Trap Randos',
	      instr: "Whoa! There are other creatures in this world. Let's see what happens when we suffocate them.",
	      has_rando: true,
	      has_finish: false
	    }
	  ];
	  this.stage_count = 0;
	  this.stage = new Stage(C.canvas.width/C.SCALE, C.canvas.height/C.SCALE, this, this.stage_config[this.stage_count]);
	}
	World.prototype.turn = function(input) {
	  this.stage.turn(this, input);
	}
	World.prototype.draw = function(ctx) {
	  this.stage.draw(ctx);
	}
	World.prototype.resetStage = function() {
	  // *Question. Should resetStage function be in World? i think so, but check when not sleep deprived hehhe.
	  this.stage = new Stage(C.canvas.width/C.SCALE, C.canvas.height/C.SCALE, this, this.stage_config[this.stage_count]);
	}
	World.prototype.hasNextStage = function() {
	  var has_next_stage = ((this.stage_count+1) < this.stage_config.length);
	  console.log('has_next_stage', has_next_stage);
	  return has_next_stage;
	}
	World.prototype.nextStage = function() {
	  this.stage_count++;
	  var stg_config = this.stage_config[this.stage_count];
	  this.stage = new Stage(C.canvas.width/C.SCALE, C.canvas.height/C.SCALE, this, stg_config);
	  // *DO LATER: possibly replace ^above with resetStage function? for efficiency. experiment more.
	}

	module.exports = World;


/***/ }
/******/ ]);