if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['./config'], function(Config) {
  var Ball = function(app) {
    this.app = app;
    this.pos({
      x: Math.floor(Config.width / 2),
      y: Math.floor(Config.height / 2)
    });
    this.width = Config.ball.width;
    this.height = Config.ball.height;
    this.speed = Config.ball.speed;
    this.dx = this.dy = -1;
    this.boardWidth = Config.width;
    this.boardHeight = Config.height;
  };

  Ball.prototype.pos = function(obj) {
    if (typeof obj !== 'undefined') {
      this.x = obj.x;
      this.y = obj.y;
    } else {
      return {
        x: this.x,
        y: this.y
      };
    }
  };

  Ball.prototype.reset = function() {
    this.dx = -this.dx;
    this.dy = -this.dy;
    this.pos({
      x: Math.floor(Config.width / 2),
      y: Math.floor(Config.height / 2)
    });
  };

  Ball.prototype.set = function(obj) {
    if (typeof obj === 'undefined') {
      return;
    }
    
    this.x = (typeof obj.x !== 'undefined') ? obj.x : this.x;
    this.y = (typeof obj.y !== 'undefined') ? obj.y : this.y;
    this.dx = (typeof obj.dx !== 'undefined') ? obj.dx : this.dx;
    this.dy = (typeof obj.dy !== 'undefined') ? obj.dy : this.dy;
  };

  Ball.prototype.testIntersection = function(obj) {
    if (typeof obj === 'undefined') {
      return;
    }
    
    if (this.x < obj.x + obj.width && this.x + this.width > obj.x &&
      this.y < obj.y + obj.height && this.y + this.height > obj.y) {
      this.dx = -this.dx;
    }
  };

  Ball.prototype.transmission = function() {
    return {
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy
    };
  };

  Ball.prototype.update = function() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    if (this.y + this.height >= this.boardHeight) {
      this.dy = -this.dy;
      this.y = this.boardHeight - this.height;
    } else if (this.y <= 0) {
      this.dy = -this.dy;
      this.y = 0;
    }

    if (this.x + this.width < 0 || this.x > Config.width) {
      this.reset();
    }
  };

  return Ball;
});