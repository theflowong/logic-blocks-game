function Finish() {
}
Finish.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = finish_col;
  ctx.fillRect(x, y, C.SCALE, C.SCALE);
}
