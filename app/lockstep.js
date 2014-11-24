var Config = require('./core/config');

var Lockstep = function(gameRoom) {
  this.gameRoom = gameRoom;
  this.sockets = [];
  this.turn = 0;
  this.move = {};
};

Lockstep.prototype.addSocket = function(socket) {
  var self = this;
  socket.on('next_move', function(msg) {
    self.move[msg.side] = msg;
    self.sendNextMove();
  });
};

// attempts to send the next move and increment the turn number,
// if both players have moved
Lockstep.prototype.sendNextMove = function() {
  var self = this;
  if (this.move['left'] && this.move['right']) {
    setTimeout(function() {
      self.gameRoom.emit('next_move', self.move);
      self.turn += 1;
      self.move = {};
    }, Config.lockstep.serverLatency);
  }
};

// start the game with the given sockets
Lockstep.prototype.start = function(sockets) {
};

module.exports = Lockstep;