var http = require('http'),
    express = require('express');
var app = express();

var server = app.listen(7122);

var io = require('socket.io').listen(server);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});



io
.of('/draw')
.on('connection', function(socket) {
    socket.emit('start', { sid: socket.id });
    socket.on('addClick', function(data) {
        data.sid = socket.id;
        socket.broadcast.emit('toDraw', data);
    });
    socket.on('disconnect', function(data) {
        console.log(socket.id + ' disconnected.');
    });
});
