define(function() {
  // Create Score prototype with render and update methods
  function Score(score, x, y, context) {
    this.score = score;
    this.x = x;
    this.y = y;
    this.ctx = context;
  };

  Score.prototype.render = function() {
    this.ctx.fillStyle = "#FFF";
    this.ctx.font = "20px 'Press Start 2P'";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.score, this.x, this.y);
  };

  Score.prototype.renderWinner = function(winMessage) {
    this.ctx.fillStyle = "#FFF";
    this.ctx.font = "16px 'Press Start 2P'";
    this.ctx.textAlign = "center";
    this.ctx.fillText(winMessage , 300, 170);
  };

  Score.prototype.update = function() {
      this.score += 1;
  };

  return Score;
});

