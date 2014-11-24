var Config = require('./core/config');

var DumbClient = function(gameRoom) {
  this.gameRoom = gameRoom;
  this.running = false;
  this.sockets = {};
};

DumbClient.prototype.addSocket = function(socket, side) {
  var self = this;

  this.sockets[socket.id] = side;

  socket.on('action', function(msg) {
    var side = self.sockets[socket.id],
      player = self.gameRoom.playerManager.getPlayer(side);

    if (msg.dy === 1 || msg.dy === 0 || msg.dy === -1) {
      player.set({ dy: msg.dy });
    }
  });
};

DumbClient.prototype.run = function() {
  var self = this;
  if (!this.running) {
    this.running = true;
  } else {
    return;
  }

  this.loop = setInterval(function() {
    self.tick();
    self.updateClients();
  }, 1000 / 15);
};

DumbClient.prototype.start = function() {
  this.run();
};

DumbClient.prototype.stop = function() {
  this.running = false;
  clearInterval(this.loop);
};

DumbClient.prototype.tick = function() {
  this.gameRoom.ball.update();
  this.gameRoom.playerManager.update();
  this.gameRoom.ball.testIntersection(this.gameRoom.playerManager.getPlayer('left'));
  this.gameRoom.ball.testIntersection(this.gameRoom.playerManager.getPlayer('right'));
};

DumbClient.prototype.updateClients = function() {
  var self = this;
  // setTimeout(function() {
    self.gameRoom.emit('state', self.gameRoom.getState());
  // }, Config.dumbclient.serverLatency);
};

module.exports = DumbClient;