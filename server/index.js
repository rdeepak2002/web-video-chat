import express from 'express';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';

const port = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origins: "*:*",
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"],
        pingTimeout: 7000,
        pingInterval: 3000
    }
});

// Middlewares
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// example of a HTTP endpoint (useful if you do db stuff later like saving messages and custom auth):
// app.get('/join', (req, res) => {
//     res.send({ link: uuidV4() });
// });

// handler when a client connects to the socket server
io.on('connection', socket => {
    console.log('user connected');

    // join a room so you can send socket messages to all other people only within that room
    socket.on('join-room', (userData) => {
        // userData object defined by client
        const { socketId, roomId, name, status } = userData;

        console.log(`user joined ${roomId}`, userData);

        socket.join(roomId);
        
        // inform all other users you have connected
        io.in(roomId).emit('new-user-connect', userData);
        
        // send your peer.js id to other users so that they can video call you via the peer.js call() api
        socket.on('peer-id-offer', (peerIdData) => {
            console.log('peer-id-offer');
            socket.to(roomId).emit('peer-id-received', peerIdData);
        });
        // send a message to all other users
        socket.on('chat-message', (chatData) => {
            console.log('chat message');
            io.to(roomId).emit('chat-message', chatData);
        });
        // provide other users with your current information
        socket.on('update', () => {
            console.log('user update');
            io.to(roomId).emit('user-update', userData);
        });
        // when user disconnects, inform all other users they have disconnected
        socket.on('disconnect', () => {
            console.log('user disconnected');
            io.in(roomId).emit('user-disconnected', userData);
        });
    });
});

// Server listen initilized
server.listen(port, () => {
    console.log(`Listening on the port ${port}`);
}).on('error', e => {
    console.error(e);
});
