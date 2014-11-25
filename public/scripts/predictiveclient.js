define([
  'ball',
  'playermanager',
  './renderer',
  './controls',
  'socket.io',
  './core/config'
], function(Ball, PlayerManager, Renderer, Controls, io, Config) {
  var PredictiveClient = function() {
    this.ball = new Ball(this);
    this.playerManager = new PlayerManager(this);
    this.renderer = new Renderer(this);
    this.controls = new Controls(this);
    this.io = io;

    this.localPlayer = undefined;
    this.lastAction = undefined;
    this.tickCount = 0;
  };

  PredictiveClient.prototype.handleJoinedRoom = function(msg) {
    msg.player.local = true;
    var player = this.playerManager.loadPlayer(msg.player, true);
    this.localPlayer = player;
    this.loadState(msg.state);

    if (msg.player.side !== 'right') {
      this.renderer.setMessage('waiting for second player');
    }
  };

  PredictiveClient.prototype.handleKeydown = function(key) {
    var dy = (key === 'up') ? -1 : 1;
    this.localPlayer.set({ dy: dy });
    this.sendAction(dy);
    this.renderer.showKeys(this.controls.keysPressed);
  };

  PredictiveClient.prototype.handleKeyup = function(key) {
    if (!this.controls.keysPressed.up && !this.controls.keysPressed.down) {
      this.localPlayer.set({ dy: 0 });
      this.sendAction(0);
    }
    this.renderer.showKeys(this.controls.keysPressed);
  };

  PredictiveClient.prototype.handleOpponentAction = function(msg) {
    var tickDelta = this.tickCount - msg.tickCount,
      opponentSide = (this.localPlayer.side === 'left') ? 'right' : 'left';

    console.log(tickDelta);
    this.playerManager.getPlayer(opponentSide).set({ dy: msg.dy });
  };

  PredictiveClient.prototype.handleStart = function(msg) {
    this.loadState(msg);
    this.start();
    this.renderer.setMessage('START!');
  };

  PredictiveClient.prototype.handleState = function(msg) {
    this.loadState(msg);
  };

  PredictiveClient.prototype.init = function() {
    var self = this;
    this.socket = this.io('/predictiveclient');
    this.controls.init(this.handleKeydown.bind(this), this.handleKeyup.bind(this));
    this.renderer.init();

    this.socket.on('joined_room', this.handleJoinedRoom.bind(this));
    this.socket.on('state', this.handleState.bind(this));
    this.socket.on('start', this.handleStart.bind(this));
    this.socket.on('opponent_action', this.handleOpponentAction.bind(this));
  };

  PredictiveClient.prototype.loadState = function(state) {
    this.playerManager.setPlayers(state.players);
    this.ball.set(state.ball);
    this.renderer.render();
    if (state.started) {
      this.started = true;
      this.renderer.setMessage('START');
    }
  };

  PredictiveClient.prototype.run = function() {
    var self = this;

    this.loop = setInterval(function() {
      self.tick();
    }, 1000 / Config.predictiveclient.fps);
  };

  PredictiveClient.prototype.sendAction = function(dy) {
    if (dy === this.lastAction) {
      return;
    }
    console.log("action sent: ", dy);
    this.socket.emit('action', {
      dy: dy,
      tickCount: this.tickCount
    });
    this.lastAction = dy;
  };

  PredictiveClient.prototype.start = function() {
    if (!this.running) {
      this.run();
      this.running = true;
    }
  };

  PredictiveClient.prototype.tick = function() {
    this.ball.update();
    this.playerManager.update();
    this.ball.testIntersection(this.playerManager.getPlayer('left'));
    this.ball.testIntersection(this.playerManager.getPlayer('right'));
    this.renderer.render();

    this.tickCount += 1;
  };

  return PredictiveClient;
});