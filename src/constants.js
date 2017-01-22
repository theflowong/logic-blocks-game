module.exports = {
  SCALE: 18,
  canvas: document.getElementById("game"),
  ctx: document.getElementById("game").getContext("2d"),
  blackhole_cap: 4,

  stage_col: 'rgba(239, 244, 240, 1)', // anti-flash white //"rgb(237,237,237)"; // background, off-white
  wall_col: "rgba(155, 193, 188, 1)",
  block_col: 'rgba(175, 219, 232, 1)', // light blue //"rgb(190,170,190)"; // purple
  rando_col: "rgb(80, 180, 180)", // teal
  finish_col: 'rgba(239, 244, 240, 1)', // stage_col 'rgba(28, 40, 59, 1)', // yankees blue
  player_col: 'rgba(235, 211, 176, 1)' // desert sand //"rgb(200,120,0)"; // orange
};
