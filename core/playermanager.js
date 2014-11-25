if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['./config', './player'], function(Config, Player) {
  var PlayerManager = function(app) {
    this.app = app;
    this.players = {};
    this.localPlayer = undefined;
  };

  PlayerManager.prototype.addPlayer = function() {
    if (typeof this.players['left'] === 'undefined') {
      this.players['left'] = new Player({
        x: 20,
        side: 'left'
      });

      return this.players['left'];
    } else if (typeof this.players['right'] === 'undefined') {
      this.players['right'] = new Player({
        x: Config.width - Config.player.width - 20,
        side: 'right'
      });

      return this.players['right'];
    } else {
      return new Error('There are already two players');
    }
  };

  PlayerManager.prototype.getPlayer = function(which) {
    if (typeof this.players[which] !== 'undefined') {
      return this.players[which];
    } else {
      return;
    }
  };

  PlayerManager.prototype.getPlayers = function() {
    return this.players;
  };

  PlayerManager.prototype.getPlayerCount = function() {
    return Object.keys(this.players).length;
  };

  PlayerManager.prototype.getSockets = function() {
    var sockets = [],
      sides = Object.keys(this.players);
    
    for (var i = 0; i < sides.length; i++) {
      sockets.push(this.players[sides[i]].socket);
    }

    return sockets;
  };

  PlayerManager.prototype.loadPlayer = function(player, local) {
    this.players[player.side] = new Player(player);

    if (typeof local !== 'undefined' && local) {
      this.localPlayer = this.players[player.side];
    }
    
    return this.players[player.side];
  };

  PlayerManager.prototype.removePlayer = function(side) {
    delete this.players[side];
  };

  PlayerManager.prototype.setPlayers = function(players) {
    var sides = Object.keys(players);

    for (var i = 0; i < sides.length; i++) {
      var side = sides[i];
      if (!this.getPlayer(side)) {
        this.loadPlayer(players[side]);
      } else {
        this.getPlayer(side).set(players[side]);
      }
    }
  };

  PlayerManager.prototype.update = function() {
    if (typeof this.players['left'] !== 'undefined') {
      this.players['left'].update();
    }

    if (typeof this.players['right'] !== 'undefined') {
      this.players['right'].update();
    }
  };

  return PlayerManager;
});