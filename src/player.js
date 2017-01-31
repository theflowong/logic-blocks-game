var C = require('./constants');
var Block = require('./block');
var BlackHole = require('./blackhole');
var Finish = require('./finish');

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
