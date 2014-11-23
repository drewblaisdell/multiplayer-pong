if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([], function() {
  return {
    width: 800,
    height: 500,
    player: {
      width: 20,
      height: 100,
      color: '#fff',
      speed: 5
    },
    ball: {
      width: 20,
      height: 20,
      color: '#fff',
      speed: 5
    }
  };
});