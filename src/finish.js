// DONE

var C = require('./constants');

function Finish() {
}
Finish.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = C.finish_col;
  ctx.fillRect(x, y, C.SCALE, C.SCALE);
}

module.exports = Finish;
