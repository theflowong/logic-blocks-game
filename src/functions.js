function randInt(low, high) {
  // returns a random integer between two given integers
  // (not including high number)
  return Math.floor(Math.random()*(high-low)+low);
}

// finds adjacent tiles to x and y
function adj(x, y, w, h) {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter(function(pos) { // filters for tiles that are contained in the grid
    return pos[0] >= 0 && pos[0] < w && pos[1] >= 0 && pos[1] < h;
  });
}

module.exports = {randInt, adj};
