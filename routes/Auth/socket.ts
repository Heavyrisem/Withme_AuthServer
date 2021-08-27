import socketio from 'socket.io';
import global from '../../global';
import Auth from '../../model/Auth';

export default async (Client: socketio.Socket) => {
    console.log("New Connect");
    if (!Client.handshake.query.mobileID) return Client.disconnect();
    const mobileID = Client.handshake.query.mobileID as string;

    try {
        global.SOCKET_CLIENTS[mobileID] = Client;
        const authed = await Auth.CheckAuthed(mobileID);
        if (authed) Client.emit("Authed", {Authed: true});
        else {
            try {
                let Devicedata = await Auth.CreateDevice(mobileID);
    
                Client.emit("Authed", {Authed: false, code: Devicedata.code});
            } catch (err) {
                ErrorHandler(err);
            }
        }
    } catch (err) {
        ErrorHandler(err);
    }

    function ErrorHandler(err: any) {
        Client.emit("error", err);
        Client.disconnect();
    }

    Client.on('disconnect', () => {
        delete global.SOCKET_CLIENTS[mobileID];
    })
}