// Call callback at 60fps
var animate = window.requestAnimationFrame ||
  window.webkitrequestAnimationFrame ||
  window.mozrequestAnimationFrame ||
  function(callback) {window.setTimeout(callback, 1000/60) 
};

// Setup canvas and get its 2d context
var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

// Instantiate game objects
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

// Keeps track of which key was pressed (left or right arrow)
var keysDown = {};


// Render the game board and objects
var render = function() {
  context.fillStyle = "#FF00FF";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

// function to continuously update computer, player and ball objects
var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

// udpate objects, render objects, and call step function recursively
var step = function() {
  update();
  render();
  animate(step);
};

// Create Paddle prototype with render and move methods
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#0000FF";
  context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if(this.x + this.width > 400) { // all the way to the right
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
};

// Create Computer prototype with new Paddle and render and update methods
function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos); // difference between middle of ball and middle of computer's paddle
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if (diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) { // all the way to the left
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) { // all the way to the right
    this.paddle.x = 400 - this.paddle.width;
  }
};

// Create Player prototype with new Paddle and render and update methods
function Player() {
  this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-4, 0);
    } else if(value == 39) { // right arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

// Create Ball prototype
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); // Draw circle
  context.fillStyle = "#000000";
  context.fill(); // Draw fill
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;

  // left, right, top and bottom of ball
  var left_x = this.x - 5;
  var top_y = this.y - 5;
  var right_x = this.x + 5;
  var bottom_y = this.y + 5;

  // Check to see if ball is hitting left or right wall
  if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed; // move ball in opposite direction horizontally
  } else if(this.x + 5 > 400) { // hitting the right wall
    this.x = 395;
    this.x_speed = -this.x_speed;
  }

  // Reset ball in center after a point is scored
  if(this.y < 0 || this.y > 600) { // a point was scored
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
  }

  if(top_y > 300) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && left_x < (paddle1.x + paddle1.width) && right_x > paddle1.x) {
      // hit the player's paddle
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2); // ball moves faster or slower depending on direction of the ball and paddle
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && left_x < (paddle2.x + paddle2.width) && right_x > paddle2.x) {
      // hit the computer's paddle
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};

// When page loads attach canvas to screen and start animate
window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

// Pushes key pressed to the keysDown object on keydown and deletes it on keyup
window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});


























































