define(['Score', 'Paddle'], function(Score, Paddle) {
  // Create Player prototype with new Paddle and render and update methods
  function Player(context) {
    this.ctx = context;
    this.paddle = new Paddle(560, 165, 30, 70, this.ctx);
    this.score = new Score(0, 400, 50, this.ctx);
  };

  Player.prototype.render = function() {
    this.paddle.render("player");
    this.score.render();
    // if(this.score.score === winningScore) {
    //   this.score.renderWinner("You win... Congrats lucky dog!");
    // } 
  };

  Player.prototype.update = function(keysDown) {
    for(var key in keysDown) {
      var value = Number(key);
      if(value == 38) { // up arrow
        this.paddle.move(0, -4);
      } else if(value == 40) { // down arrow
        this.paddle.move(0, 4);
      } else {
        this.paddle.move(0, 0);
      }
    }
  };

  return Player;
});