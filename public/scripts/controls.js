define([], function() {
  var Controls = function(app) {
    this.app = app;
    this.keysPressed = {};
  };

  Controls.prototype.init = function(keydownCallback, keyupCallback) {
    var self = this;

    document.addEventListener('keydown', function(event) {
      var key = event.which || event.keyCode;

      self.keysPressed.up = (key === 38);
      self.keysPressed.down = (key === 40);

      if (key === 38 || key === 40) {
        if (typeof keydownCallback !== 'undefined') {
          var direction = (key === 38) ? 'up' : 'down';
          keydownCallback(direction);
        }

        event.preventDefault();
      }
    });

    document.addEventListener('keyup', function(event) {
      var key = event.which || event.keycode;

      self.keysPressed.up = (key === 38) ? false : self.keysPressed.up;
      self.keysPressed.down = (key === 40) ? false : self.keysPressed.down;

      if (key === 38 || key === 40) {
        if (typeof keyupCallback !== 'undefined') {
          var direction = (key === 38) ? 'up' : 'down';
          keyupCallback(direction);
        }

        event.preventDefault();
      }
    });
  };

  return Controls;
});