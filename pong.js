// Refresh animation at 60fps
var animate = window.requestAnimationFrame ||
  window.webkitrequestAnimationFrame ||
  window.mozrequestAnimationFrame ||
  function(callback) {window.setTimeout(callback, 1000/60) 
};

var cancelAnimate = window.cancelAnimationFrame || 
  window.mozCancelAnimationFrame || 
  window.webkitCancelAnimationFrame;

var requestId;

// Setup canvas and get its 2d context
var canvas = document.createElement('canvas');
var width = 600;
var height = 400;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

// Instantiate game objects
var player = new Player();
var computer = new Computer();
var ball = new Ball(300, 200);

var winningScore = 21;

// Keeps track of which key was pressed (left or right arrow)
var keysDown = {};

// Using img onerror trick to load google font
var loadCSS = function(url, callback){
    var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;

    document.getElementsByTagName('head')[0].appendChild(link);

    var img = document.createElement('img');
        img.onerror = function(){
            if(callback) callback(link);
        }
        img.src = url;
}

// Render the game board and objects
var render = function() {
  context.fillStyle = "#000"; //#FF00FF
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();

  // Once the game is over, remove ball from screen
  if(player.score.score < winningScore && computer.score.score < winningScore) {
    ball.render();
  }
};

// function to continuously update computer, player and ball objects
var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle, player.score, computer.score);
};

// udpate objects, render objects, and call step function recursively
var step = function() {
  update();
  render();
  requestId = animate(step);

  // Cancel animation once the winning score is reached
  if(player.score.score === winningScore || computer.score.score === winningScore) {
    cancelAnimate(requestId);
  }
};

// Create Score prototype with render and update methods
function Score(score, x, y) {
  this.score = score;
  this.x = x;
  this.y = y;
}

Score.prototype.render = function() {
  context.font = "20px 'Press Start 2P'";
  context.textAlign = "center";
  context.fillText(this.score, this.x, this.y);
};

Score.prototype.renderWinner = function(winMessage) {
  context.font = "16px 'Press Start 2P'";
  context.textAlign = "center";
  context.fillText(winMessage , 300, 200);
};

Score.prototype.update = function() {
    this.score += 1;
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
  context.fillStyle = "#FFF"; // #0000FF
  context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 0) { // all the way at the top
    this.y = 0;
    this.y_speed = 0;
  } else if(this.y + this.height > 400) { // all the way at the bottom
    this.y = 400 - this.height;
    this.y_speed = 0;
  }
};

// Create Computer prototype with new Paddle and render and update methods
function Computer() {
  this.paddle = new Paddle(10, 175, 10, 50);
  this.score = new Score(0, 200, 30);
}

Computer.prototype.render = function() {
  this.paddle.render();
  this.score.render();
  if (this.score.score === winningScore) {
    this.score.renderWinner("I win!! I always do...");
  }
};

Computer.prototype.update = function(ball) {
  var y_pos = ball.y;
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

// Create Player prototype with new Paddle and render and update methods
function Player() {
  this.paddle = new Paddle(580, 175, 10, 50);
  this.score = new Score(0, 400, 30);
}

Player.prototype.render = function() {
  this.paddle.render();
  this.score.render();
  if(this.score.score === winningScore) {
    this.score.renderWinner("You win... Congrats lucky dog!");
  } 
};

Player.prototype.update = function(ball) {
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

// Create Ball prototype
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 3;
  this.y_speed = 0;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); // Draw circle
  context.fillStyle = "#FFF"; // #000
  context.fill(); // Draw fill
};

Ball.prototype.update = function(paddle1, paddle2, score1, score2) {
  this.x += this.x_speed;
  this.y += this.y_speed;

  // left, right, top and bottom of ball
  var left_x = this.x - 5;
  var top_y = this.y - 5;
  var right_x = this.x + 5;
  var bottom_y = this.y + 5;

  // Check to see if ball is hitting top or bottom wall
  if(this.y - 5 < 0) { // hitting the top wall
    this.y = 5;
    this.y_speed = -this.y_speed; // move ball in opposite direction vertically
  } else if(this.y + 5 > 400) { // hitting the bottom wall
    this.y = 395;
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
    this.y = 200;
  }

  if(right_x > 300) {
    if((top_y < (paddle1.y + paddle1.height)) && (bottom_y > paddle1.y) && (left_x <= paddle1.x) && (right_x > paddle1.x)) {
      // hit the player's paddle
      this.x_speed = -3;
      this.y_speed += (paddle1.y_speed / 2); // ball moves faster or slower depending on direction of the ball and paddle
      this.x += this.x_speed;
    }
  } else {
    if((top_y < (paddle2.y + paddle2.height)) && (bottom_y > paddle2.y) && (left_x < (paddle2.x + paddle2.width)) && (right_x >= (paddle2.x + paddle2.width))) {
      // hit the computer's paddle
      this.x_speed = 3;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  }
};

// When page loads attach canvas to screen and start animate
window.onload = function() {
  loadCSS('http://fonts.googleapis.com/css?family=Press+Start+2P');
  document.body.appendChild(canvas);
  requestId = animate(step);
};

// Pushes key pressed event to the keysDown object on keydown and deletes it on keyup
window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

