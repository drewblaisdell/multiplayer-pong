var GameRoom = require('./gameroom');

// accepts an instance of socket.io
var GameServer = function(io) {
  this.io = io;
  this.sockets = {};
  this.rooms = {};
  this.roomCount = 0;
};

GameServer.prototype.handleConnection = function(namespace, socket) {
  if (!this.rooms[namespace]) {
    this.rooms[namespace] = [];
  }

  var current;
  for (var i = 0, l = this.rooms[namespace].length; i < l; i++) {
    if (this.rooms[namespace][i] &&
      (this.rooms[namespace][i].getPlayerCount() === 1 || this.rooms[namespace][i].getPlayerCount() === 0)) {
      current = this.rooms[namespace][i];
      break;
    }
  }

  if (typeof current === 'undefined' || current.getPlayerCount() === 2) {
    // the rooms are all full or none exist, create a new one
    var roomName = this.rooms[namespace].length + '-'+ namespace;
    current = new GameRoom(this.io, {
      type: namespace,
      name: roomName
    });

    this.rooms[namespace].push(current);
    
    current.addPlayer(socket);

    socket.join(current.name);
  } else if (current.getPlayerCount() === 0 || current.getPlayerCount() === 1) {
    // add player to the last empty room
    current.addPlayer(socket);
    socket.join(current.name);
  }
};

GameServer.prototype.init = function() {
  this.lockstepNsp = this.io.of('/lockstep');
  this.lockstepNsp.on('connection', this.handleConnection.bind(this, 'lockstep'));
};

module.exports = GameServer;