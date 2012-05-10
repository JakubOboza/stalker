var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var stalker = require("./lib/stalker");

var port = process.env['PORT'] || 4444 ;

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('view engine', 'ejs');
});

app.configure('production', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler());
    app.set('view engine', 'ejs');
});

app.listen(port);

app.get('/', function (req, res) {
  res.render('index.ejs');
});

io.sockets.on('connection', function (socket) {
  new stalker("test.file", function(content){
    socket.emit('entry', { content: content });
  });
});


