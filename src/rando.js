var C = require('./constants');
var stage = require('./stage');

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

module.exports = Rando;
