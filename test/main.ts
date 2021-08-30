import io from 'socket.io-client';

console.log("test");
let socket = io("https://withme.heavyrisem.xyz/socket", {query: {mobileID: "nuguTestID"}, path: '/auth', transports: ['websocket']});

socket.on('connect', () => {
    console.log("conn");
})

socket.on("Authed", data => {
    console.log("Authed", data);
});
socket.on("error", data => {
    console.log("error", data);
})

// socket.on('error')

socket.connect();