var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var GameServer = require('./app/gameserver');

var environment = process.env.NODE_ENV || 'development';

app.set('port', process.env.PORT || 3000);

if (environment) {
  app.use(express.static(path.join(__dirname, 'public')));
}

http.listen(app.get('port'), function() {
  var gameServer = new GameServer(io);
  gameServer.init();

  console.log('pong started: '+ app.get('port') +' ('+ environment +')');
});