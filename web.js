var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var stalker = require("./lib/stalker");

var port = process.env['PORT'] || 4444 ;

app.listen(port);

function handler (req, res) {
  fs.readFile(__dirname + '/public/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  new stalker("test.file", function(content){
    socket.emit('entry', { content: content });
  });
});