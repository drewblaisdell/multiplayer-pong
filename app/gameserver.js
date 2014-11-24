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

  var current = this.rooms[namespace][this.rooms[namespace].length - 1];
  if (typeof current === 'undefined' || current.getPlayerCount() === 2 || current.getPlayerCount() === 0) {
    // the rooms are all full or none exist, create a new one
    var roomName = this.rooms[namespace].length + '-'+ namespace;
    current = new GameRoom(this.io, {
      type: namespace,
      name: roomName
    });

    this.rooms[namespace].push(current);
    
    current.addPlayer(socket);

    socket.join(current.name);
    console.log("player added to new room", current.name);
  } else if (current.getPlayerCount() === 1) {
    // add player to the last empty room
    current.addPlayer(socket);
    socket.join(current.name);
    console.log("player added to existing room", current.name);
  }
};

GameServer.prototype.init = function() {
  this.lockstepNsp = this.io.of('/lockstep');
  this.lockstepNsp.on('connection', this.handleConnection.bind(this, 'lockstep'));
  this.dumbclientNsp = this.io.of('/dumbclient');
  this.dumbclientNsp.on('connection', this.handleConnection.bind(this, 'dumbclient'));
};

module.exports = GameServer;