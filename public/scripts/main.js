require.config({
  baseUrl: 'scripts/core/',
  paths: {
    'socket.io': '/socket.io/socket.io.js'
  }
});

require(['../' + appType], function(App) {
  window.app = new App();
  app.init();
});