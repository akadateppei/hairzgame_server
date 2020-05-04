var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//ここでただ一つのボードが作られる（全員共通）
var playerList = [];
var id = 0;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    console.log('a user connected');

    //プレイヤー参加
    socket.on('player name', (playerName) => {
        id++;
        var player = {playerId: "user" + id, player_name: playerName, socketId: socket.id};
        playerList.push(player);
        io.emit('player info', playerList);
        if (id == 1){
          io.emit('you are starter', "");
        };
        console.log(player);
    });

    // ゲームスタート
    socket.on('game start', () =>{
        // ボード初期化
        var model = require('./model.js');
        //ゲームスタートを表示させる
        io.emit('display event', "game start" + '<br>' + playerList[0].player_name + 'の番です。');
        io.to(playerList[0].socketId).emit('your turn', "あなたの番です");
    });

    socket.on('roll dice', (dice) =>{
       console.log(dice);
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