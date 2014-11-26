if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['./config'], function(Config) {
  var Player = function(options) {
    var options = options || {};
    this.options = options;
    this.x = (typeof options.x !== 'undefined') ? options.x : 0;
    this.y = (typeof options.y !== 'undefined') ? options.y : Config.height / 2 - Config.player.height / 2;
    this.dx = (typeof options.dx !== 'undefined') ? options.dx : 10;
    this.dy = (typeof options.dy !== 'undefined') ? options.dy : 10;
    this.score = (typeof options.score !== 'undefined') ? options.score : 0;
    this.local = (typeof options.local !== 'undefined') ? options.local : false;
    this.side = options.side;
    
    this.width = Config.player.width;
    this.height = Config.player.height;
    this.speed = Config.player.speed;
    this.dx = this.dy = 0;
  };

  Player.prototype.pos = function(obj) {
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

  Player.prototype.set = function(obj) {
    this.x = (typeof obj.x !== 'undefined') ? obj.x : this.x;
    this.y = (typeof obj.y !== 'undefined') ? obj.y : this.y;
    this.dx = (typeof obj.dx !== 'undefined') ? obj.dx : this.dx;
    this.dy = (typeof obj.dy !== 'undefined') ? obj.dy : this.dy;
    this.score = (typeof obj.score !== 'undefined') ? obj.score : this.score;
  };

  Player.prototype.update = function() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    if (this.y + this.height >= Config.height) {
      this.y = Config.height - this.height;
    } else if (this.y <= 0) {
      this.y = 0;
    }
  };

  Player.prototype.transmission = function() {
    return {
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy,
      side: this.side,
      score: this.score
    };
  };

  return Player;
});