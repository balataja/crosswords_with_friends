const Koa = require('koa');
//const express = require('express');
const mongoose = require('mongoose');
const logger = require('koa-logger');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const routes = require('./routes');
const config = require('./config');
const IO = require('koa-socket-2');
const http  = require('http')
const socket = require('socket.io')


// Make mongoose use native ES6 promises
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(config.database.url, config.database.opts);

const app = new Koa()
  .use(cors())
  .use(logger())
  .use(bodyParser())
  .use(routes);

const server = http.createServer(app.callback())
const io = socket(server)

console.log('attempting to connect..')
io.sockets.on('connection', function(socket){
  console.log('connected: ' + socket.id)
  //socket.emit('your_id', socket.id);

  socket.on('room', function(room) {
    console.log('socketId: ' + socket.id + ' joined room#: ' + room);
    socket.join(room);
  });

  socket.on('clue_answered', function(msg){
    //nsp.emit('update_model', msg);
    console.log('client: ' + socket.id + ' answeredBy: ' + msg.playerNumber +  ' room#: ' + msg.roomNumber);
    //socket.broadcast.emit('update_other_users', 'too slow!')
    io.sockets.in(msg.roomNumber).emit('update_other_users', 'too slow!');
  });

  socket.on('player_joined_game', function(msg){
    //nsp.emit('update_model', msg);
    console.log('player: ' + socket.id + ' number: ' + msg.playerNumber + ' joined the game.')
    io.sockets.in(msg.roomNumber).emit('other_player_joined_game', msg.playerNumber);
  });

  socket.on('player_left_game', function(msg){
    //nsp.emit('update_model', msg);
    console.log('player: ' + socket.id + ' number: ' + msg.playerNumber + ' has left the game.')
    io.sockets.in(msg.roomNumber).emit('player_disconnected', 'player ' + msg.playerNumber + ' has disconnected.');
  });

  socket.on('disconnect', function(msg) {
    console.log('server: player disconnected..');
    //socket.broadcast.emit('player_disconnected', msg)
    io.sockets.in(msg.roomNumber).emit('player_disconnected', 'player disconnected.');
  })
  
  //socket.on('checking_clue', function(msg){
    //nsp.emit('update_model', msg);
    //console.log(msg)
    //io.emit('update_other_users', 'too slow!')
  //});
});

// const server = http.listen(config.server.port, function(){
//   console.log('listening on *:' + config.server.port);
// });

const temp = server.listen(config.server.port);

module.exports = temp;
