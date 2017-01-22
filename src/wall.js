var C = require('./constants');

function Wall() {
}
Wall.prototype.draw = function(ctx, x, y) {
  // define functions inside prototype (only creates one instance of function)
  // ctx is a global variable
  ctx.fillStyle = C.wall_col; //"rgba(155, 193, 188, 1)"; //wall_col;
  ctx.fillRect(x, y, C.SCALE, C.SCALE);
}

module.exports = Wall;
