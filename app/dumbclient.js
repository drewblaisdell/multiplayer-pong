var Config = require('./core/config');

var DumbClient = function(gameRoom) {
  this.gameRoom = gameRoom;
  this.playerManager = gameRoom.playerManager;
  this.ball = gameRoom.ball;
  this.sockets = {};
};

DumbClient.prototype.addSocket = function(socket, side) {
  var self = this;

  this.sockets[socket.id] = side;

  socket.on('action', function(msg) {
    var side = self.sockets[msg.id],
      player = self.playerManager.getPlayer(side);

    if (msg.dy === 1 || msg.dy === 0 || msg.dy === -1) {
      player.set({ dy: msg.dy });
    }
  });
};

DumbClient.prototype.run = function() {
  var self = this;
  this.loop = setInterval(function() {
    self.tick();
    self.updateClients();
  }, 1000 / 15);
};

DumbClient.prototype.start = function() {
  this.run();
};

DumbClient.prototype.tick = function() {
  this.ball.update();
  this.playerManager.update();
};

DumbClient.prototype.updateClients = function() {
  this.gameRoom.emit('state', this.gameRoom.getState());
};

module.exports = DumbClient;