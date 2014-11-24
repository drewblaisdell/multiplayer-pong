if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([], function() {
  return {
    width: 500,
    height: 200,
    player: {
      width: 10,
      height: 60,
      color: '#fff',
      speed: 10
    },
    ball: {
      width: 20,
      height: 20,
      color: '#fff',
      speed: 5
    },
    lockstep: {
      turnLength: 33,
      serverLatency: 0
    }
  };
});