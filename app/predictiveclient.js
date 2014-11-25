var Config = require('./core/config');

var PredictiveClient = function(gameRoom) {
  this.gameRoom = gameRoom;
  this.sockets = {};
  this.tickCount = 0;
  this.running = false;
};

PredictiveClient.prototype.addSocket = function(socket, side) {
  var self = this;

  this.sockets[socket.id] = side;

  socket.on('action', function(msg) {
    var side = self.sockets[socket.id],
      player = self.gameRoom.playerManager.getPlayer(side);

    if (msg.dy === 1 || msg.dy === 0 || msg.dy === -1) {
      player.set({ dy: msg.dy });
      socket.broadcast.emit('opponent_action', {
        dy: msg.dy,
        tickCount: self.tickCount
      });
    }
  });
};

PredictiveClient.prototype.run = function() {
  var self = this;

  this.loop = setInterval(function() {
    self.tick();

    if (self.tickCount % 15 === 0) {
      self.updateClients();
    }
  }, 1000 / Config.predictiveclient.fps);
};

PredictiveClient.prototype.start = function() {
  if (!this.running) {
    this.gameRoom.emit('start', this.gameRoom.getState());
    this.run();
    this.running = true;
    console.log('started');
  }
};

PredictiveClient.prototype.stop = function() {
  this.running = false;
  clearInterval(this.loop);
};

PredictiveClient.prototype.tick = function() {
  this.gameRoom.ball.update();
  this.gameRoom.playerManager.update();
  this.gameRoom.ball.testIntersection(this.gameRoom.playerManager.getPlayer('left'));
  this.gameRoom.ball.testIntersection(this.gameRoom.playerManager.getPlayer('right'));
  
  this.tickCount += 1;
};

PredictiveClient.prototype.updateClients = function() {
  var self = this;
  setTimeout(function() {
    var state = self.gameRoom.getState();
    state.tickCount = self.tickCount;
    self.gameRoom.emit('state', state);
  }, Config.predictiveclient.serverLatency);
};

module.exports = PredictiveClient;