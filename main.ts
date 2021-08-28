import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import middleware from './middleware';

import Auth from './routes/Auth';
import socket from './routes/Auth/socket';

import './model/DB';

const App = express();
const Server = http.createServer(App);
const io = new socketio.Server(Server, {path: '/auth', transports: ['websocket', 'polling']});

App.use(middleware.Parser);
App.use(middleware.NUGU_Dev);
App.use((req, res, next) => {
    console.log(req.url);
    next()
})

io.of('/socket').on('connection', socket);
App.use(Auth);


Server.listen(3000, () => {
    console.log('Auth server online');
})