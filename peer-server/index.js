const { PeerServer } = require('peer');

const port = process.env.PORT || 8081;
const peerServer = PeerServer({ port: port, path: '/peerjs' });