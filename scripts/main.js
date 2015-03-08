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
