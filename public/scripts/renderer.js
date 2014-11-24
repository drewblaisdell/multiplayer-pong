define(['config'], function(Config) {
  var Renderer = function(app) {
    this.app = app;
    this.controls = app.controls;
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = Config.width;
    this.height = Config.height;
    this.playerManager = app.playerManager;
    this.ball = app.ball;
    this.message = document.getElementById('message');
    this.keyUp = document.getElementById('key-up');
    this.keyDown = document.getElementById('key-down');
  };

  Renderer.prototype.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  Renderer.prototype.init = function() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  };

  Renderer.prototype.render = function() {
    this.clear();

    this.renderPlayer(this.playerManager.getPlayer('left'));
    this.renderPlayer(this.playerManager.getPlayer('right'));
    this.renderBall(this.ball);
  };

  Renderer.prototype.renderBall = function(ball) {
    if (typeof ball === 'undefined') {
      return;
    }

    var pos = this.ball.pos();
    this.context.fillStyle = Config.ball.color;
    this.context.fillRect(pos.x, pos.y, this.ball.width, this.ball.height);
  };

  Renderer.prototype.renderPlayer = function(player) {
    if (typeof player === 'undefined') {
      return;
    }

    var pos = player.pos();
    this.context.fillStyle = Config.player.color;
    this.context.fillRect(pos.x, pos.y, player.width, player.height);
  };

  Renderer.prototype.setMessage = function(message) {
    this.message.innerHTML = message;
  };

  Renderer.prototype.showKeys = function(keysPressed) {
    if (keysPressed.up) {
      this.keyUp.className = 'active';
    } else {
      this.keyUp.className = '';      
    }

    if (keysPressed.down) {
      this.keyDown.className = 'active';
    } else {
      this.keyDown.className = '';      
    }      
  };

  return Renderer;
});