var _ = require('underscore');

var Lockstep = function(gameRoom, sockets) {
  this.gameRoom = gameRoom;
  this.sockets = [];
  this.turn = 0;
  this.moves = {
    left: [],
    right: []
  };
};

Lockstep.prototype.handleReceiveMove = function(msg) {
  this.moves[msg.side][this.turn] = msg;
};

Lockstep.prototype.nextMove = function() {
  var self = this;
  if (this.moves['left'][this.turn] && this.moves['right'][this.turn]) {
    this.gameRoom.emit('player_moves', {
      turn: this.turn,
      left: this.moves['left'][this.turn],
      right: this.moves['right'][this.turn]
    });

    this.turn += 1;

    setTimeout(function() {
      self.nextMove();
    }, 200);
  } else {
    setTimeout(function() {
      self.nextMove();
    }, 200);
  }
};

Lockstep.prototype.start = function(sockets) {
  var self = this;
  this.sockets = sockets;

  setTimeout(function() {
    self.nextMove();
  }, 200);
};

module.exports = Lockstep;