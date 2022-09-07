#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from "../src/server";
// import {WebSocketServer} from "ws";
import {Server} from "socket.io";
import debug0 from "debug";
import http from "http";

const debug = debug0('zoom:server');
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
/**
 * Create WebSocket server.
 */
// const wss = new WebSocketServer({server})
const io = new Server(server);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

io.on("connect", socket => {
    socket.on("enter_room", (roomName, showRoom)=>{
        socket.join(roomName);
        showRoom(roomName);
        socket.to(roomName).emit("join_new_user");
    });

    socket.on("disconnecting", (roomName, showRoom)=>{
        socket.rooms.forEach(room => {
           socket.to(room).emit("leave_user");
        });
    });

    socket.on("new_message", (message,roomName, newMessage)=>{
        newMessage(message);
        socket.to(roomName).emit("new_message",message);
    });
});
// const sockets = [];
// wss.on("connection", (socket) => {
//     console.log("Connected to Browser ✅");
//     socket["nickname"] = "Anon";
//     sockets.push(socket);
//
//     socket.on("close", () => {
//         console.log(`Disconnected to ${socket.nickname} ❌`);
//         console.log(sockets.length);
//     });
//
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg.toString());
//
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach((aSocket) => {
//                     if(aSocket !== socket)
//                         aSocket.send(`${socket.nickname}: ${message.payload}`)
//                 });
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     });
// });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


