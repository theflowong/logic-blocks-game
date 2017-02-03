var C = require('./constants');
var Stage = require('./stage');

function World() {
  this.stage_config = [
    {
      title: 'Escape to Finish',
      instr: 'Escape the board! Hint: look at the border.',
      has_rando: false,
      has_finish: true
    },
    {
      title: 'Push Blocks into BlackHoles',
      instr: 'Vanish a BlackHole. Hint: try some pushing some stuff into each other.',
      has_rando: false,
      has_finish: false
    },
    {
      title: 'Trap Randos',
      instr: "Whoa! There are other creatures in this world. Let's see what happens when we suffocate them.",
      has_rando: true,
      has_finish: false
    }
  ];
  this.stage_count = 0;
  this.stage = new Stage(C.canvas.width/C.SCALE, C.canvas.height/C.SCALE, this, this.stage_config[this.stage_count]);
}
World.prototype.turn = function(input) {
  this.stage.turn(this, input);
}
World.prototype.draw = function(ctx) {
  this.stage.draw(ctx);
}
World.prototype.resetStage = function() {
  // *Question. Should resetStage function be in World? i think so, but check when not sleep deprived hehhe.
  this.stage = new Stage(C.canvas.width/C.SCALE, C.canvas.height/C.SCALE, this, this.stage_config[this.stage_count]);
}
World.prototype.nextStage = function() {
  this.stage_count++;
  var stg_config = this.stage_config[this.stage_count];
  this.stage = new Stage(C.canvas.width/C.SCALE, C.canvas.height/C.SCALE, this, stg_config);
  // *DO LATER: possibly replace ^above with resetStage function? for efficiency. experiment more.
}

module.exports = World;
