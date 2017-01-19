function Wall() {
}
Wall.prototype.draw = function(ctx, x, y) {
  // define functions inside prototype (only creates one instance of function)
  // ctx is a global variable
  ctx.fillStyle = "rgba(155, 193, 188, 1)"; //wall_col;
  ctx.fillRect(x, y, 18, 18); // SCALE = 18
}

module.exports = Wall;
