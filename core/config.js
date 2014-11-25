if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([], function() {
  return {
    width: 500,
    height: 300,
    player: {
      width: 5,
      height: 40,
      color: '#fff',
      speed: 10
    },
    ball: {
      width: 15,
      height: 15,
      color: '#fff',
      speed: 5
    },
    lockstep: {
      turnLength: 100,
      serverLatency: 20
    },
    terminalclient: {
      clientLatency: 200,
      serverLatency: 200
    },
    predictiveclient: {
      clientLatency: 100,
      fps: 15,
      positionTolerance: 60,
      serverLatency: 100,
      smoothing: true
    }
  };
});