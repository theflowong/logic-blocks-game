var C = require('./constants');

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
