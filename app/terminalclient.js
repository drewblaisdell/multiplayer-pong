var Config = require('./core/config');

var TerminalClient = function(gameRoom) {
  this.gameRoom = gameRoom;
  this.running = false;
  this.sockets = {};
};

TerminalClient.prototype.addSocket = function(socket, side) {
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

TerminalClient.prototype.run = function() {
  var self = this;
  if (!this.running) {
    this.running = true;
  } else {
    return;
  }

  this.loop = setInterval(function() {
    self.tick();
    self.updateClients();
  }, 1000 / Config.terminalclient.fps);
};

TerminalClient.prototype.start = function() {
  this.run();
};

TerminalClient.prototype.stop = function() {
  this.running = false;
  clearInterval(this.loop);
};

TerminalClient.prototype.tick = function() {
  this.gameRoom.ball.update();
  this.gameRoom.playerManager.update();
  this.gameRoom.ball.testIntersection(this.gameRoom.playerManager.getPlayer('left'));
  this.gameRoom.ball.testIntersection(this.gameRoom.playerManager.getPlayer('right'));
};

TerminalClient.prototype.updateClients = function() {
  var self = this,
    state = this.gameRoom.getState();
  setTimeout(function() {
    self.gameRoom.emit('state', state);
  }, Config.terminalclient.serverLatency);
};

module.exports = TerminalClient;