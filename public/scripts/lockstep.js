define([
  'ball',
  'playermanager',
  './renderer',
  './controls',
  'socket.io'
], function(Ball, PlayerManager, Renderer, Controls, io) {
  var LockstepApp = function() {
    this.ball = new Ball(this);
    this.playerManager = new PlayerManager(this);
    this.renderer = new Renderer(this);
    this.controls = new Controls(this);
    this.io = io;

    this.turn = 0;
    this.currentMove = {};
    this.moves = [];
  };

  LockstepApp.prototype.handleJoinedRoom = function(msg) {
    msg.player.local = true;
    this.playerManager.loadPlayer(msg.player, true);
    this.loadState(msg.state);
    if (msg.player.side !== 'right') {
      this.renderer.setMessage('waiting for second player');
    }
  };

  LockstepApp.prototype.handleKeypress = function(action) {
    this.moves[this.turn] = {
      action: action,
      turn: this.turn,
      side: this.playerManager.localPlayer.side
    };
  };

  LockstepApp.prototype.handlePlayerMoves = function(msg) {
    var self = this;
    this.currentMove = msg;
    this.turn += 1;
    setTimeout(function() {
      self.currentMove = {};
      self.sendMove();
    }, 200);
  };

  LockstepApp.prototype.handleStart = function(msg) {
    this.renderer.setMessage("START!");
    setTimeout(this.sendMove.bind(this), 200);
  };

  LockstepApp.prototype.init = function() {
    var self = this;
    this.socket = this.io('/lockstep');
    this.controls.init(this.handleKeypress.bind(this));
    this.renderer.init();

    this.socket.on('connect', function() {
      self.run();
    });

    this.socket.on('joined_room', this.handleJoinedRoom.bind(this));
    this.socket.on('started', this.handleStart.bind(this));
    this.socket.on('player_moves', this.handlePlayerMoves.bind(this));
  };

  LockstepApp.prototype.loadState = function(state) {
    this.playerManager.setPlayers(state.players);
    this.ball.set(state.ball);
  };

  LockstepApp.prototype.run = function() {
    var self = this;
    this.loop = setInterval(function() {
      self.tick();
    }, 1000 / 30);
  };

  LockstepApp.prototype.sendMove = function() {
    if (!this.moves[this.turn]) {
      this.moves[this.turn] = {
        turn: this.turn,
        action: 'none',
        side: this.playerManager.localPlayer.side
      };
    }

    this.socket.emit('next_move', this.moves[this.turn]);
  };

  LockstepApp.prototype.tick = function() {
    if (this.currentMove && this.currentMove.left && this.currentMove.right) {
      var players = this.playerManager.getPlayers(),
        sides = Object.keys(this.playerManager.getPlayers());

      for (var i = 0; i < sides.length; i++) {
        var side = sides[i];

        if (this.currentMove[side].action === 'up') {
          players[side].dy = -1;
        } else if (this.currentMove[side].action === 'down') {
          players[side].dy = 1;
        } else {
          players[side].dy = 0;
        }
      }
      this.playerManager.update();
    }

    this.ball.update();
    this.renderer.render();
  };

  return LockstepApp;
});