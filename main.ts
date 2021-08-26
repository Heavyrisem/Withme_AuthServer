import express from 'express';
import middleware from './middleware';

import Auth from './routes/Auth';

import './model/DB';
import { NUGU_Response } from './routes/Types';

const Server = express();

Server.use(middleware.Parser);

Server.use('/auth', Auth);

Server.use('/test', (req, res) => {
    console.log(req.body);
    let d = new NUGU_Response<{result: string}>({result: "우부부에부에부에"});
    res.send(d.toString());
})

Server.listen(9998, () => {
    console.log('Auth server online');
})