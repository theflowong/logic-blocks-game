// Things to check, marked with: *Question.
// Things to do, marked with: *DO LATER:

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

const C = require("./constants");

const Wall = require("./wall");
const Block = require('./block');
const BlackHole = require('./blackhole');
const Finish = require("./finish");

const Player = require("./player");
const Stage = require("./stage");
const World = require('./world');


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
})

// draw game
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.draw(ctx);
  window.requestAnimationFrame(drawGame);
}

window.requestAnimationFrame(drawGame);
