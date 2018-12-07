var socket_io = require('socket.io');
var config = require('./config.js');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

//http://localhost:3000?engine=http://localhost:3005&game=${id}
//var boardurl = 'http://localhost:3000'
//var engineurl = 'http://localhost:3005'

io.on('connection', function(socket){
    console.log('A user connected');

    socketApi.onNewClientCallback();

    //TODO: this should be a rest API
    //socket.on('queue_snake', function (data) {
    //    console.log(data.name, ' ', data.url);
    //});
});

socketApi.onNewClientCallback = function(){}

socketApi.broadcastGameStart = function(gameId) {
    var gameurl = `${config.boardurl}?engine=${config.engineurl}&game=${gameId}`;
    io.sockets.emit('game_start', {url: gameurl});
}

socketApi.broadcast = function(eventName, data){
    io.sockets.emit(eventName, data);
} 

module.exports = socketApi;
