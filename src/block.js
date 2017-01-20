var C = require('./constants');

function Block() {
}
// same as wall... possible extension?
Block.prototype.draw = function(ctx, x, y) {
  ctx.fillStyle = C.block_col;
  ctx.fillRect(x, y, C.SCALE, C.SCALE);
}

module.exports = Block;
