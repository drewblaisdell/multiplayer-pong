define([
  'ball',
  'playermanager',
  './renderer',
  './controls',
  'socket.io',
  './core/config'
], function(Ball, PlayerManager, Renderer, Controls, io, Config) {
  var LockstepApp = function() {
    this.ball = new Ball(this);
    this.playerManager = new PlayerManager(this);
    this.renderer = new Renderer(this);
    this.controls = new Controls(this);
    this.io = io;

    this.turn = 0;
    this.tick = 0;
    this.sentMove = [];
    this.started = false;
  };

  LockstepApp.prototype.checkKeys = function() {
    if (this.controls.keysPressed.up) {
      this.handleKeypress('up');
    } else if (this.controls.keysPressed.down) {
      this.handleKeypress('down');
    }
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
    if (!this.started) {
      return;
    }

    var dy = (action === 'up') ? -1 : 1;

    this.sendNextMove(dy);
  };

  LockstepApp.prototype.handleNextMove = function(msg) {
    var self = this,
      k = Object.keys(msg);

    this.ball.update();

    for (var i = 0; i < k.length; i++) {
      var player = this.playerManager.getPlayer(k[i]);
      player.set({ dy: msg[k[i]].dy });
      player.update();
      this.ball.testIntersection(player);
    }

    this.renderer.render();
    this.turn += 1;

    setTimeout(function() {
      // send a blank move if none has been sent
      self.sendBlankMove();
    }, Config.lockstep.turnLength);
  };

  LockstepApp.prototype.init = function() {
    var self = this;
    this.socket = this.io('/lockstep');
    this.controls.init();
    this.renderer.init();

    this.socket.on('joined_room', this.handleJoinedRoom.bind(this));
    this.socket.on('state', this.loadState.bind(this));
    this.socket.on('state_reset', this.resetState.bind(this));
    this.socket.on('next_move', this.handleNextMove.bind(this));

    setInterval(function() {
      self.checkKeys();
    }, 33);
  };

  LockstepApp.prototype.loadState = function(state) {
    this.playerManager.setPlayers(state.players);
    this.ball.set(state.ball);
    this.renderer.render();
    if (state.started) {
      this.started = true;
      this.renderer.setMessage('START');
    }
  };

  LockstepApp.prototype.resetState = function(state) {
    this.loadState(state);
    this.turn = 0;
    this.tick = 0;
    this.sentMove = [];
    this.started = false;
  };

  LockstepApp.prototype.sendBlankMove = function() {
    this.sendNextMove(0);
  };

  LockstepApp.prototype.sendNextMove = function(dy) {
    if (this.sentMove[this.turn]) {
      return;
    }

    this.socket.emit('next_move', {
      dy: dy,
      side: this.playerManager.localPlayer.side
    });

    this.sentMove[this.turn] = true;
    this.renderer.setMessage('sent move #'+ this.turn);
  };

  return LockstepApp;
});