import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import middleware from './middleware';

import Auth from './routes/Auth';
import socket from './routes/Auth/socket';

import './model/DB';

const App = express();
const Server = http.createServer(App);
const io = new socketio.Server(Server);

App.use(middleware.Parser);

App.use('/', Auth);

io.on('connection', socket);

Server.listen(9998, () => {
    console.log('Auth server online');
})