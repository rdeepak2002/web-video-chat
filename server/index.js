import express from 'express';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';

const port = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.WEB_APP_ORIGIN || 'http://localhost:3000';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: CORS_ORIGIN
    }
});

// Middlewares
app.use(cors({
    origin: CORS_ORIGIN
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// example of a HTTP endpoint (useful if you do db stuff later like saving messages and custom auth):
// app.get('/join', (req, res) => {
//     res.send({ link: uuidV4() });
// });

io.on('connection', socket => {
    console.log('user connected');

    socket.on('join-room', (userData) => {
        const { socketId, roomId, name, status } = userData;

        console.log(`user joined ${roomId}`, userData);

        socket.join(roomId);
        io.in(roomId).emit('new-user-connect', userData);
        socket.on('chat-message', (chatData) => {
            console.log('chat message');
            io.to(roomId).emit('chat-message', chatData);
        });
        socket.on('update', () => {
            console.log('user update');
            io.to(roomId).emit('user-update', userData);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
            io.in(roomId).emit('user-disconnected', userData);
        });
        socket.on('broadcast-message', (message) => {
            io.in(roomId).emit('new-broadcast-messsage', {...message, userData});
        });
        // socket.on('reconnect-user', () => {
        //     socket.to(roomID).broadcast.emit('new-user-connect', userData);
        // });
        socket.on('display-media', (value) => {
            io.in(roomId).emit('display-media', {socketId, value });
        });
        socket.on('user-video-off', (value) => {
            io.in(roomId).emit('user-video-off', value);
        });
    });
});

// Server listen initilized
server.listen(port, () => {
    console.log(`Listening on the port ${port}`);
}).on('error', e => {
    console.error(e);
});