var C = require('./constants');
var stage = require('./stage');
var randInt = require('./functions').randInt;
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
