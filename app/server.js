var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//ここでただ一つのボードが作られる（全員共通）
var model = require('./model.js');
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(model);

  socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});