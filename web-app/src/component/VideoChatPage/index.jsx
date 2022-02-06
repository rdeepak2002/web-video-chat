import {Box, Button, FormGroup, Grid, TextField, Typography} from "@mui/material";
import {createRef, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import qs from "qs";
import {k_video_chat_route} from "../../App";
import {k_name_search_param, k_room_code_search_param} from "../HomePage";
import socketIOClient from "socket.io-client";
import { v4 as uuidV4 } from 'uuid';
import Peer from "peerjs";

// TODO: update this to read value from environment variables
const API_ENDPOINT = "http://localhost:8080";

// keep track of possible status for clients
const k_connected_status = "connected";
const k_disconnected_status = "disconnected";

// video chatting page
const VideoChatPage = () => {
    // reference to socket handler
    const [socketHandler, setSocketHandler] = useState(undefined);

    // keep track of peer connections
    const [myPeer, setMyPeer] = useState(undefined);

    const myVideoRef = useRef(null);

    // keep track of what the user's name and the room code
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [userId, setUserId] = useState(`${uuidV4()}`);

    // keep track of video clients
    const [clients, setClients] = useState({
            // 'id1': {
            //     socketId: 'id1',
            //     roomId: 'testval',
            //     name: 'user a',
            //     status: k_connected_status
            // },
            // 'id2': {
            //     socketId: 'id2',
            //     roomId: 'testval',
            //     name: 'user b',
            //     status: k_connected_status
            // },
            // 'id3': {
            //     socketId: 'id3',
            //     roomId: 'testval',
            //     name: 'user c',
            //     status: k_connected_status
            // },
            // 'id4': {
            //     socketId: 'id4',
            //     roomId: 'testval',
            //     name: 'user d',
            //     status: k_connected_status
            // },
    });

    // keep track of chat messages
    const [chatMessages, setChatMessages] = useState([
        // {
        //     guid: 'guid1',
        //     socketId: 'id1',
        //     message: 'message 1'
        // },
        // {
        //     guid: 'guid2',
        //     socketId: 'id2',
        //     message: 'message 1'
        // },
        // {
        //     guid: 'guid3',
        //     socketId: 'id3',
        //     message: 'message 1'
        // },
    ]);

    // get the search string, ex: "?name=deepak&room-code=abc123"
    const { search } = useLocation();

    // function to navigate between pages
    const navigate = useNavigate();

    // get user's video
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then(stream => {
                let video = myVideoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error("error:", err);
            });
    }, [myVideoRef])

    // every time the search string changes (should happen only once), run this function
    useEffect(() => {
        // navigate to home if search params are empty
        if (!search || search.length <= 0) {
            navigate(k_video_chat_route);
            return;
        }

        // remove the question mark present in the beginning of search params
        const searchWithoutQuestionMark = search.substring(1);
        const parsedSearch = qs.parse(searchWithoutQuestionMark);

        // get the name of person and room code from search params
        const nameFromSearch = parsedSearch[k_name_search_param];
        const roomCodeFromSearch = parsedSearch[k_room_code_search_param];

        // navigate to home if search params are not valid
        if(!nameFromSearch || nameFromSearch.length <= 0 || !roomCodeFromSearch || roomCodeFromSearch.length <= 0) {
            navigate(k_video_chat_route);
            return;
        }

        // otherwise if everything is valid and we were able to get the search params, store these as variables
        setUserName(nameFromSearch);
        setRoomCode(roomCodeFromSearch);
    }, [search]);

    // create connection to socket client
    useEffect(() => {
        // check whether roomCode and userName are valid
        if(roomCode && userName && roomCode.trim().length > 0 && userName.trim().length > 0) {
            // create peer connection
            const peer = new Peer(userId, {
                host: 'localhost',
                port: 8081,
                path: '/peerjs'
            });

            peer.on('connection', function(conn) {
                console.log('peer connected to us', conn);
            });

            // TODO: implement peer.call
            // TODO: implement peer.call
            // TODO: implement peer.call
            // https://peerjs.com/docs.html#start

            setMyPeer(peer);

            // create socket connection
            const socket = socketIOClient(API_ENDPOINT);

            socket.on("new-user-connect", data => {
                const socketId = data.socketId;
                const clientsCopy = clients;
                clientsCopy[socketId] = data;
                setClients(Object.assign({}, clientsCopy));

                // tell all other users this user has 'updated'
                socket.emit("update", {
                    socketId: userId,
                    roomId: roomCode,
                    name: userName,
                    status: k_connected_status
                });
            });

            socket.on("user-update", data => {
                const socketId = data.socketId;
                const clientsCopy = clients;
                clientsCopy[socketId] = data;
                console.log('user update')
                setClients(Object.assign({}, clientsCopy));

                // dont allow user to connect to themself
                if(socketId !== userId) {
                    // setting up peer connection
                    const conn = peer.connect(socketId);

                    console.log('peer connection', conn);

                    conn.on('open', function() {
                        console.log('peer opened', conn);

                        // Receive messages
                        conn.on('data', function(data) {
                            console.log('Received', data);
                        });

                        // Send messages
                        conn.send('Hello!');
                    });
                }
            });

            socket.on("user-disconnected", data => {
                const socketId = data.socketId;
                const clientsCopy = clients;
                clientsCopy[socketId].status = k_disconnected_status
                setClients(Object.assign({}, clientsCopy));
            });

            socket.on("chat-message", data => {
                console.log('chat message', data);
                const chatMessagesCopy = chatMessages;
                chatMessagesCopy.push(data);
                setChatMessages([...chatMessagesCopy]);
            });

            // join the socket room
            socket.emit("join-room", {
                socketId: userId,
                roomId: roomCode,
                name: userName,
                status: k_connected_status
            });

            // update socket handler variable so other parts of code can call this
            setSocketHandler(socket);

            // disconnect the socket after this page closes
            return () => {
                socket.disconnect();
                peer.disconnect();
            };
        }
    }, [userName, roomCode]);

    // render the page
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                bgcolor: 'background.default',
                color: 'text.primary'
            }}
        >
            <Grid container direction={"row"} spacing={0} sx={{
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
            }}>
                <VideoFeeds clients={clients} myVideoRef={myVideoRef} />
                <Chat clients={clients} chatMessages={chatMessages} socketHandler={socketHandler} userId={userId}/>
            </Grid>
        </Box>
    );
}

const VideoFeeds = (props) => {
    return(
        <Grid item xs={9}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    bgcolor: 'background.default',
                    color: 'text.primary'
                }}
            >
                <div className="video-feeds-wrapper">
                    {
                        Object.keys(props.clients).map((clientId) => {
                            const client = props.clients[clientId];

                            if(client.status === k_connected_status) {
                                return (
                                    <div key={clientId} className="video-feed">
                                        <Typography>{client.name}</Typography>
                                        <Typography>{clientId}</Typography>
                                    </div>
                                );
                            }
                        })
                    }
                    <div className="video-feed">
                        <Typography>{'You'}</Typography>
                        <video ref={props.myVideoRef} />
                    </div>
                </div>
            </Box>
        </Grid>
    );
}

const Chat = (props) => {
    const [message, setMessage] = useState('');

    // function to send a message
    const sendMessage = (message) => {
        // prevent empty message from being sent
        if(message || message.trim().length > 0) {
            if(props.socketHandler) {
                // emit message to socket server
                props.socketHandler.emit('chat-message', {
                    guid: uuidV4(),
                    socketId: props.userId,
                    message: message
                });

                // clear text field after sending message
                setMessage('');
            }
        }
    }

    return(
        <Grid item xs={3}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    bgcolor: 'background.darker',
                    color: 'text.primary'
                }}
            >
                {/*List of messages*/}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        flexGrow: 1,
                        width: '100%',
                        color: 'text.primary',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            flexGrow: 1,
                            width: '100%',
                            color: 'text.primary',
                            // padding: '20px'
                        }}
                    >
                        {
                            props.chatMessages.map((chatMessage) => {
                                const client = props.clients[chatMessage.socketId]

                                return (
                                    <Box
                                        key={chatMessage.guid}
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        <Typography>Name: {client.name}</Typography>
                                        <Typography>Message: {chatMessage.message}</Typography>
                                        {/*grey horizontal line*/}
                                        <Box sx={{
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                            width: '100%',
                                            height: '2px',
                                            bgcolor: '#6b6b6b'
                                        }}/>
                                    </Box>
                                );
                            })
                        }
                    </Box>
                </Box>
                {/*Input field form*/}
                <FormGroup
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        color: 'text.primary',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexGrow: 0.1,
                            width: '100%',
                            color: 'text.primary',
                            columnGap: '10px',
                            padding: '10px'
                        }}
                    >
                        <TextField id="message-input" label="Message" variant="standard" value={message}
                            onChange={(event) => {
                                setMessage(event.target.value);
                            }} sx={{
                                flexGrow: 1
                            }}
                        />
                        <Button variant="contained" onClick={() => {sendMessage(message)}}>Send</Button>
                    </Box>
                </FormGroup>
            </Box>
        </Grid>
    );
}


export default VideoChatPage;