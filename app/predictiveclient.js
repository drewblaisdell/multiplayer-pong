var Config = require('./core/config');

var PredictiveClient = function(gameRoom) {
  this.gameRoom = gameRoom;
  this.sockets = {};
  this.lastTick = { left: 0, right: 0 };
  this.tickCount = 0;
  this.running = false;
};

PredictiveClient.prototype.addSocket = function(socket, side) {
  var self = this;

  this.sockets[socket.id] = side;

  socket.on('position', this.handlePosition.bind(this, socket));
};

PredictiveClient.prototype.handlePosition = function(socket, msg) {
  var side = this.sockets[socket.id],
    player = this.gameRoom.playerManager.getPlayer(side);

  if (this.lastTick[side] > msg.tickCount) {
    // out of order packet
    return;
  } else {
    this.lastTick[side] = msg.tickCount;
  }

  // restrict movement to only three speeds
  if (msg.dy === 1 || msg.dy === 0 || msg.dy === -1) {
    var tickDelta = this.tickCount - msg.tickCount,
      playerDelta = Math.abs(player.y - msg.y),
      tolerance = Config.predictiveclient.positionTolerance;

    if (playerDelta <= tolerance) {
      player.set({ y: msg.y, dy: msg.dy });
    }

    // send the new player info to the opponent
    setTimeout(function() {
      socket.broadcast.emit('opponent_position', {
        y: player.y,
        dy: player.dy,
        tickCount: this.tickCount
      });
    }, Config.predictiveclient.serverLatency);
  }
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
    var state = this.gameRoom.getState();
    state.tickCount = 0;
    this.gameRoom.emit('start', state);
    this.run();
    this.running = true;
    console.log('started');
  }
};

PredictiveClient.prototype.stop = function() {
  console.log("STOP");
  this.running = false;
  clearInterval(this.loop);
  this.lastTick = { left: 0, right: 0 };
  this.tickCount = 0;
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