define([], function() {
  var Controls = function(app) {
    this.app = app;
    this.keysPressed = {};
  };

  Controls.prototype.init = function(callback) {
    var self = this;

    document.addEventListener('keydown', function(event) {
      var key = event.which || event.keyCode;

      self.keysPressed.up = (key === 38);
      self.keysPressed.down = (key === 40);

      if (key === 38 || key === 40) {
        if (typeof callback !== 'undefined') {
          var direction = (key === 38) ? 'up' : 'down';
          callback(direction);
        }

        event.preventDefault();
      }
    });
  };

  return Controls;
});