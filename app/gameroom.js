var _ = require('underscore');
var PlayerManager = require('./core/playermanager');
var Ball = require('./core/ball');
var Lockstep = require('./lockstep');

var GameRoom = function(io, options) {
  this.io = io;

  var options = options || {};
  this.options = options;

  this.type = options.type;
  this.name = options.name;

  this.playerManager = new PlayerManager();
  this.ball = new Ball();

  this.empty = false;
  this.started = false;

  if (this.type === 'lockstep') {
    this.gameEngine = new Lockstep(this);
  }
};

GameRoom.prototype.addPlayer = function(socket) {
  var player = this.playerManager.addPlayer();
  player.socket = socket;

  this.gameEngine.addSocket(socket);

  socket.emit('joined_room', {
    player: player.transmission(),
    room: this.name,
    state: this.getState()
  });

  this.bindEventHandlers(socket, player);

  if (this.playerManager.getPlayerCount() === 2) {
    this.start();
  }
};

GameRoom.prototype.bindEventHandlers = function(socket, player) {
  socket.on('disconnect', this.handleDisconnect.bind(this, player.side));
};

GameRoom.prototype.emit = function(eventName, data) {
  _.forEach(this.playerManager.getSockets(), function(socket) {
    socket.emit(eventName, data);
  });
};

GameRoom.prototype.getPlayerCount = function() {
  return this.playerManager.getPlayerCount();
};

GameRoom.prototype.getState = function() {
  var players = _.object(_.map(this.playerManager.getPlayers(), function(player) {
    return [player.side, player.transmission()];
  }));

  return {
    players: players,
    ball: this.ball,
    started: this.started
  };
};

GameRoom.prototype.handleDisconnect = function(side) {
  this.playerManager.removePlayer(side);

  if (this.playerManager.getPlayerCount() === 0) {
    this.empty = true;
    this.reset();
  } else {
    this.started = false;
    this.ball = new Ball();
    this.emit('state_reset', this.getState());
  }
};

GameRoom.prototype.reset = function() {
  if (this.type === 'lockstep') {
    this.gameEngine = new Lockstep(this);
    this.ball = new Ball();
    this.playerManager = new PlayerManager();
    this.started = false
  }
};

GameRoom.prototype.start = function() {
  var sockets = this.playerManager.getSockets(),
    self = this;

  this.started = true;
  setTimeout(function() {
    console.log('!!!!! starting '+ self.name +' !!!!!');
    self.emit('state', self.getState());
    self.gameEngine.start(self.playerManager.getSockets());
  }, 1000);
};

module.exports = GameRoom;