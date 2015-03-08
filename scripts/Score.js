// Create Score prototype with render and update methods
function Score(score, x, y) {
  this.score = score;
  this.x = x;
  this.y = y;
};

Score.prototype.render = function() {
  ctx.fillStyle = "#FFF";
  ctx.font = "20px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText(this.score, this.x, this.y);
};

Score.prototype.renderWinner = function(winMessage) {
  ctx.fillStyle = "#FFF";
  ctx.font = "16px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText(winMessage , 300, 170);
};

Score.prototype.update = function() {
    this.score += 10;
};
