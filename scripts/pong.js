define(['Computer', 'Player', 'Ball'], function(Computer, Player, Ball) {
  // Refresh animation at 60fps
  var animate = window.requestAnimationFrame ||
    window.webkitrequestAnimationFrame ||
    window.mozrequestAnimationFrame ||
    function(callback) {window.setTimeout(callback, 1000/60)};

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
  var ctx = canvas.getContext('2d');

  // Instantiate game objects
  var player = new Player(ctx);
  var computer = new Computer(ctx);
  var ball = new Ball(300, 191, ctx);

  var winningScore = 21;
  var isNotPaused = false; // toggled by keydown event listener
  var start = 0; // updated by update() function to signal game has started

  // Keeps track of which key was pressed (left or right arrow)
  var keysDown = {};

  // Initialize game over menu elements
  var tweet = document.getElementById("tweet");
  var restart = document.getElementById("restart");
  tweet.href ='http://twitter.com/share?url=https://uberpong.herokuapp.com/&text=I just pwned ' 
              + 'some robot n00bs in the funky fresh game Uber Pong! &count=horiztonal';

  // Using img onerror trick to load google font
  var loadCSS = function(url, callback) {
      var link = document.createElement('link');
          link.type = 'text/css';
          link.rel = 'stylesheet';
          link.href = url;

      document.getElementsByTagName('head')[0].appendChild(link);

      var img = document.createElement('img');
          img.onerror = function() {
              if(callback) callback(link);
          };
          img.src = url;
  };

  // Render the game board and objects
  var render = function() {
    // ctx.fillStyle = "#000"; //#FF00FF
    // ctx.fillRect(0, 0, width, height);

    var img = document.getElementById("canvas");
    ctx.drawImage(img, 0, 0, 600, 400, 0, 0, width, height);

    player.render();
    computer.render();

    // As long as the game is not over, render the ball
    if(player.score.score < winningScore && computer.score.score < winningScore) {
      ball.render();
    }

    if(player.score.score === winningScore) {
      player.score.renderWinner("You win... Congrats lucky dog!");
    } else if(computer.score.score === winningScore) {
      computer.score.renderWinner("I win!! I always do...");
    }

    // Display game over menu once game ends
    if(player.score.score === winningScore || computer.score.score === winningScore) {
      tweet.style.display = "inline-block";
      restart.style.display = "inline-block";
    }
  };

  // function to continuously update computer, player and ball objects
  var update = function() {
    player.update(keysDown);
    computer.update(ball);
    ball.update(player.paddle, computer.paddle, player.score, computer.score);
    if(!start) { // if game has not yet started
      start += 1;
    }
  };

  // udpate objects, render objects, and call step function recursively
  var step = function(timestamp) {
    // If isNotPaused is true, pause the game, otherwise continue with animation sequence
    if(isNotPaused) { // pause at start of game
      update();
    } 

    render();

    if(!isNotPaused && start) { // if game is paused and has started
      // Show user that game is paused
      ctx.fillStyle = "#FFF";
      ctx.font = "20px 'Press Start 2P'";
      ctx.textAlign = "center";
      ctx.fillText("Paused" , 300, 170);
    } else if(!isNotPaused && !start) { // if game is paused but has not started yet
      // Show welcome message
      ctx.fillStyle = "#FFF";
      ctx.font = "48px 'Press Start 2P'";
      ctx.textAlign = "center";
      ctx.fillText("UBER PONG" , 300, 170);
      ctx.font = "12px 'Press Start 2P'";
      ctx.fillText("Press space bar to toggle play/pause" , 300, 230);
    }

    requestId = animate(step);

    // Cancel animation once the winning score is reached
    if(player.score.score === winningScore || computer.score.score === winningScore) {
      cancelAnimate(requestId);
    }
  };

  // When page loads attach canvas to screen and start animate
  window.onload = function() {
    loadCSS('https://fonts.googleapis.com/css?family=Press+Start+2P');
    document.body.appendChild(canvas);
    requestId = animate(step);
  };

  // Pushes key pressed event to the keysDown object on keydown and deletes it on keyup
  window.addEventListener("keydown", function(event) {
    var value = Number(event.keyCode);

    keysDown[event.keyCode] = true;
    if(value == 32) { // space bar
      isNotPaused = !isNotPaused; // toggle play/pause state
    }
  });

  window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });

  window.onload();
});
