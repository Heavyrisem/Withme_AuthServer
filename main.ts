import express from 'express';
import middleware from './middleware';

import Auth from './routes/Auth';

import './model/DB';

const Server = express();

Server.use(middleware.Parser);

Server.use('/auth', Auth);

Server.listen(9998, () => {
    console.log('Auth server online');
})