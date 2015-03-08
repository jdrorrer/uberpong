// Create Computer prototype with new Paddle and render and update methods
function Computer() {
  this.paddle = new Paddle(10, 165, 30, 70);
  this.score = new Score(0, 200, 50);
};

Computer.prototype.render = function() {
  this.paddle.render("computer");
  this.score.render();
  if (this.score.score === winningScore) {
    this.score.renderWinner("I win!! I always do...");
  }
};

Computer.prototype.update = function(ball) {
  var y_pos = ball.y + 7; // + 7 for radius of ball
  var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos); // difference between middle of ball and middle of computer's paddle
  if(diff < 0 && diff < -4) { // max speed up
    diff = -5;
  } else if (diff > 0 && diff > 4) { // max speed down
    diff = 5;
  }
  this.paddle.move(0, diff);
  if(this.paddle.y < 0) { // all the way to the top
    this.paddle.x = 0;
  } else if (this.paddle.y + this.paddle.height > 400) { // all the way to the bottom
    this.paddle.x = 400 - this.paddle.height;
  }
};