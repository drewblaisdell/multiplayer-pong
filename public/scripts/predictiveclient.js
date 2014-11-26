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
    this.renderer.showKeys(this.controls.keysPressed);
  };

  PredictiveClient.prototype.handleKeyup = function(key) {
    if (!this.controls.keysPressed.up && !this.controls.keysPressed.down) {
      this.localPlayer.set({ dy: 0 });
    }
    this.renderer.showKeys(this.controls.keysPressed);
  };

  PredictiveClient.prototype.handleOpponentPosition = function(msg) {
    var opponentSide = (this.localPlayer.side === 'left') ? 'right' : 'left',
      opponent = this.playerManager.getPlayer(opponentSide);

    opponent.set({ y: msg.y, dy: msg.dy });
  };

  PredictiveClient.prototype.handleStart = function(msg) {
    this.tickCount = 0;
    this.loadState(msg);
    this.start();
    this.renderer.setMessage('START!');
  };

  PredictiveClient.prototype.handleState = function(msg) {
    this.loadState(msg);
    this.tickCount = msg.tickCount;
  };

  PredictiveClient.prototype.init = function() {
    var self = this;
    this.socket = this.io('/predictiveclient');
    this.controls.init(this.handleKeydown.bind(this), this.handleKeyup.bind(this));
    this.renderer.init();

    this.socket.on('joined_room', this.handleJoinedRoom.bind(this));
    this.socket.on('state', this.handleState.bind(this));
    this.socket.on('start', this.handleStart.bind(this));
    this.socket.on('opponent_position', this.handleOpponentPosition.bind(this));
  };

  PredictiveClient.prototype.loadState = function(state) {
    var thisSide = this.localPlayer.side,
      tickDelta = this.tickCount - state.tickCount;

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

  PredictiveClient.prototype.start = function() {
    if (!this.running) {
      this.run();
      this.running = true;
    }
  };

  PredictiveClient.prototype.tick = function() {
    var self = this;
    this.ball.update();
    this.playerManager.update();
    this.ball.testIntersection(this.playerManager.getPlayer('left'));
    this.ball.testIntersection(this.playerManager.getPlayer('right'));
    this.renderer.render();

    this.tickCount += 1;

    if (this.localPlayer) {
      setTimeout(function() {
        self.socket.emit('position', {
          y: self.localPlayer.y,
          dy: self.localPlayer.dy,
          tickCount: self.tickCount
        });
      }, Config.predictiveclient.clientLatency);
    }
  };

  return PredictiveClient;
});