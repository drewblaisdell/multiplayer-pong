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
      speed: 7
    },
    lockstep: {
      turnLength: 33,
      serverLatency: 100
    },
    terminalclient: {
      clientLatency: 200,
      fps: 30,
      serverLatency: 200
    },
    predictiveclient: {
      clientLatency: 100,
      fps: 30,
      positionTolerance: 40,
      serverLatency: 100
    }
  };
});