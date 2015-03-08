define(function() {
  // Create Ball prototype
  function Ball(x, y, context) {
    this.x = x;
    this.y = y;
    this.ctx = context;
    this.x_speed = 3;
    this.y_speed = 0;
    this.radius = 5;
  };

  Ball.prototype.render = function() {
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); // Draw circle
    // ctx.fillStyle = "#FFF"; // #000
    // ctx.fill(); // Draw fill 

    var img = document.getElementById("ball");
    this.ctx.drawImage(img, 0, 0, 20, 20, this.x, this.y, 30, 30);
  };

  Ball.prototype.update = function(paddle1, paddle2, score1, score2) {
    this.x += this.x_speed;
    this.y += this.y_speed;

    // left, right, top and bottom of ball
    var left_x = this.x + 5;
    var top_y = this.y + 5;
    var right_x = this.x + 15;
    var bottom_y = this.y + 15;

    // Check to see if ball is hitting top or bottom wall
    if(this.y < 0) { // hitting the top wall
      this.y = 0;
      this.y_speed = -this.y_speed; // move ball in opposite direction vertically
    } else if(this.y + 20 > 400) { // hitting the bottom wall
      this.y = 380;
      this.y_speed = -this.y_speed;
    }

    if(this.x < 0) { // Player scored a point
      score1.update();
    } else if(this.x > 600) { // Computer scored a point
      score2.update();
    }

    // Reset ball in center after a point is scored
    if(this.x < 0 || this.x > 600) { // a point was scored
      this.x_speed = 3;
      this.y_speed = 0;
      this.x = 300;
      this.y = 191;
    }

    if(right_x > 300) {
      if((top_y < (paddle1.y + paddle1.height)) && (bottom_y > paddle1.y) && (left_x <= (paddle1.x + 15)) && (right_x > paddle1.x)) {
        // hit the player's paddle
        this.x_speed = -3;
        this.y_speed += (paddle1.y_speed / 2); // ball moves faster or slower depending on direction of the ball and paddle
        this.x += this.x_speed;
      }
    } else {
      if((top_y < (paddle2.y + paddle2.height)) && (bottom_y > paddle2.y) && (left_x < (paddle2.x + paddle2.width)) && (right_x >= (paddle2.x + paddle2.width - 15))) {
        // hit the computer's paddle
        this.x_speed = 3;
        this.y_speed += (paddle2.y_speed / 2);
        this.x += this.x_speed;
      }
    }
  };

  return Ball;
});