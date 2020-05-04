var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//ここでただ一つのボードが作られる（全員共通）
var board = require('./model.js');
var playerList = [];
var id = 0;
var turn = 0;
var numberOfPlayer = 0;
var goaledPlayer = 0;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    console.log('a user connected');

    //プレイヤー参加
    socket.on('player name', (playerName) => {
        id++;
        numberOfPlayer++;
        var player = {playerId: id, player_name: playerName, socketId: socket.id, move: 0, point: 0, goal: false};
        playerList.push(player);
        io.emit('player info', playerList);
        if (id == 1) {
            io.emit('you are starter', "");
        }
        ;
        console.log(player);
    });

    // ゲームスタート
    socket.on('game start', () => {
        //ゲームスタートを表示させる
        io.emit('display event', "game start" + '<br>' + playerList[0].player_name + 'の番です。');
        io.to(playerList[0].socketId).emit('your turn', "あなたの番です");
    });

    socket.on('roll dice', (dice) => {
        console.log(turn);
        console.log('numberofplayer' + numberOfPlayer);
        playerList[turn].move += dice;
        if (playerList[turn].move > 22){
            goaledPlayer++;
            playerList[turn].move = 23;
            playerList[turn].goal = true;
            io.emit('display event', playerList[turn].player_name + 'がゴールしました。')
        }else{
            playerList[turn].point += board[playerList[turn].move].balance;
            // マスによって分岐
            switch (board[playerList[turn].move].move) {
                case 0:
                    io.emit('end turn', board[playerList[turn].move].title + "<br>" + "青春ポイント" + board[playerList[turn].move].balance);
                    break;
                case "start":
                    playerList[turn].move = 0;
                    break;
                case "goal": // Todo: ゴール処理書いたら追加
                    break;
                default:
                    io.emit('end turn', board[playerList[turn].move].title + "<br>" + "青春ポイント" + board[playerList[turn].move].balance + "<br>" + "移動" + board[playerList[turn].move].move);
            }
        }
        io.emit('player info', playerList);
        turn++
        // ターン巻き戻し
        if (turn === numberOfPlayer) {
            turn = 0;
        };
        console.log(turn);
        io.to(playerList[turn].socketId).emit('your turn', "あなたの番です");
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});