// Create Paddle prototype with render and move methods
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
};

Paddle.prototype.render = function(type) {
  // ctx.fillStyle = "#FFF"; // #0000FF
  // ctx.fillRect(this.x, this.y, this.width, this.height);
  var img;

  if(type === "player") {
    img = document.getElementById("player");
    ctx.drawImage(img, 0, 0, 24, 54, this.x, this.y, this.width, this.height);
  } else if(type === "computer") {
    img = document.getElementById("computer");
    ctx.drawImage(img, 0, 0, 24, 54, this.x, this.y, this.width, this.height);
  }
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