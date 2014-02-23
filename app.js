var http = require('http'),
    express = require('express');
var app = express();

var server = app.listen(7122);

var io = require('socket.io').listen(server);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});



io.of('/draw')
.on('connection', function(socket) {
    socket.emit('start', { sid: socket.id });
    socket.on('addClick', function(data) {
        data.sid = socket.id;
        data.stamp = (new Date).valueOf();
        socket.emit('toDraw', data);
        socket.broadcast.emit('toDraw', data);
    });
    socket.on('disconnect', function(data) {
        console.log(socket.id + ' disconnected.');
    });
});

io.of('/chat')
.on('connection', function(socket) {
    socket.emit('news', { color: 'red', name: 'Server', msg: 'Welcome!' });
    socket.join('lobby');
    
    socket.on('newmsg', function(data) {
        socket.broadcast.to('lobby').emit('news', {color: data.color, name: data.name, msg: data.msg });
    });
});
