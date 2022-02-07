import {Box, Button, FormGroup, Grid, TextField, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import qs from "qs";
import {k_video_chat_route} from "../../App";
import {k_name_search_param, k_room_code_search_param} from "../HomePage";
import socketIOClient from "socket.io-client";
import {v4 as uuidV4} from 'uuid';
import Peer from "peerjs";

// get url of socket server
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

// keep track of possible status for clients
const k_connected_status = "connected";
const k_disconnected_status = "disconnected";

// video chatting page
const VideoChatPage = () => {
    // reference to socket handler
    const [socketHandler, setSocketHandler] = useState(undefined);

    // keep track of video streams from clients
    const [remoteStreams, setRemoteStreams] = useState({});

    // keep track of what the user's name and the room code
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [userId, setUserId] = useState(`${uuidV4()}`);

    const myVideoRef = useRef(undefined);

    // keep track of video clients
    const [clients, setClients] = useState({
        // 'id1': {
        //     socketId: 'id1',
        //     roomId: 'testval',
        //     name: 'user a',
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
    ]);

    // get the search string, ex: "?name=deepak&room-code=abc123"
    const {search} = useLocation();

    // function to navigate between pages
    const navigate = useNavigate();

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
        if (!nameFromSearch || nameFromSearch.length <= 0 || !roomCodeFromSearch || roomCodeFromSearch.length <= 0) {
            navigate(k_video_chat_route);
            return;
        }

        // otherwise if everything is valid and we were able to get the search params, store these as variables
        setUserName(nameFromSearch);
        setRoomCode(roomCodeFromSearch);
    }, [search]);

    const addVideoStream = (remoteStream, peerId) => {
        // console.log('adding video stream for peer', remoteStream.id);
        const remoteStreamsCopy = remoteStreams;
        remoteStreamsCopy[peerId] = remoteStream;
        setRemoteStreams(Object.assign({}, remoteStreamsCopy));
    }

    useEffect(() => {
        if(userId.trim().length > 0) {
            // add our own video stream to the screen
            navigator.mediaDevices.getUserMedia({video: true, audio: true })
                .then((stream) => {
                    // add your own video to the list of videos
                    addVideoStream(stream, userId, true);
                })
                .catch((e) => {
                    alert('Error accessing camera and microphone');
                    console.log('Error getting user media', e);
                });
        }
    }, [userId]);

    useEffect(() => {
        if (userId && userName) {
            // data of this user
            const userData = {
                socketId: userId,
                roomId: roomCode,
                name: userName,
                status: k_connected_status
            };

            // setup peer connection
            const peer = new Peer(userId, {
                // host: "web-video-chat-peer-server-v2.herokuapp.com",
                'iceServers': [
                    {url: 'stun:stun.l.google.com:19302'},
                    {url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username: 'web...@live.com'},
                    {url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'web...@live.com'},
                    {
                        url: 'turn:192.158.29.39:3478?transport=udp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=tcp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    }
                ]
            })

            // setup socket connection
            const socket = process.env.REACT_APP_ENV === "PRODUCTION" ? socketIOClient(API_ENDPOINT, {secure: true}) : socketIOClient(API_ENDPOINT, {secure: true});

            // function to call other peers
            const callPeer = (id) => {
                navigator.mediaDevices.getUserMedia({video: true, audio: true})
                    .then((stream) => {
                        // console.log('our video stream we will send', stream);

                        // attempt to call the other person with this stream
                        let call = peer.call(id, stream);

                        call.on('stream', (remoteStream) => {
                            // TODO: this is the video of the new peer - display it?
                            // console.log('stream from person I called', remoteStream);
                            addVideoStream(remoteStream, id);

                            // let all other clients know about the data of this user
                            socket.emit("update", userData);
                        });
                    })
                    .catch((e) => {
                        console.log('Error calling', e);
                    });
            }

            // setup peer listeners
            // peer connection opens
            peer.on('open', (myPeerId) => {
                // inform other clients about your peer id
                // console.log('my peer id', myPeerId);
                socket.emit('peer-id-offer', {id: myPeerId}); // send your peerid to other users in the room via socket.io
            });

            // handle receiving call from other clients in the room
            peer.on('call', (call) => {
                // send your own stream for the caller and add the caller stream to your page
                navigator.mediaDevices.getUserMedia({video: true, audio: true})
                    .then((stream) => {
                        // console.log('our video stream we will respond with', stream);

                        call.answer(stream);
                        call.on('stream', (remoteStream) => {
                            // TODO: handle receiving video call from someone else
                            // console.log('stream from person who called me', remoteStream);
                            addVideoStream(remoteStream, call.peer);

                            // let all other clients know about the data of this user
                            socket.emit("update", userData);
                        })

                    })
                    .catch((e) => {
                        console.log('Error answering call', e);
                    });
            })

            // setup socket listeners
            // listener for new peerjs id
            socket.on('peer-id-received', (data) => {
                // console.log('received peer id', data.id);
                const newPeerId = data.id;
                callPeer(newPeerId);
            });

            // listener for chat messages
            socket.on("chat-message", (data) => {
                // console.log('chat message', data);
                const chatMessagesCopy = chatMessages;
                chatMessagesCopy.push(data);
                setChatMessages([...chatMessagesCopy]);
            });

            // listener for people who disconnect
            socket.on("user-disconnected", (data) => {
                // console.log('user disconnected', data);
                // remove video stream
                try {
                    const disconnectedSocketId = data.socketId;
                    const remoteStreamsCopy = remoteStreams;
                    delete remoteStreamsCopy[disconnectedSocketId];
                    setRemoteStreams(Object.assign({}, remoteStreamsCopy));
                } catch (err) {
                    console.warn('error removing user video stream', err);
                }

                // update their client info as disconnected
                try {
                    const disconnectedSocketId = data.socketId;
                    const clientsCopy = clients;
                    clientsCopy[disconnectedSocketId].status = k_disconnected_status;
                    setClients(Object.assign({}, clientsCopy));
                } catch (err) {
                    console.warn('error updating user status', err);
                }
            });

            // listener for when a user updates their information (name, etc.)
            socket.on("user-update", (data) => {
                // console.log('user updated their info', data);
                const clientsCopy = clients;
                clientsCopy[data.socketId] = data;
                setClients(Object.assign({}, clientsCopy));
            });

            // join the socket room
            socket.emit("join-room", userData);

            // let all other clients know about the data of this user
            socket.emit("update", userData);

            // set state variable
            setSocketHandler(socket);

            return () => {
                socketHandler.close();
                peer.disconnect();
            };
        }
    }, [userId, userName])

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
                <VideoFeeds userId={userId} clients={clients} myVideoRef={myVideoRef} remoteStreams={remoteStreams}/>
                <Chat clients={clients} chatMessages={chatMessages} socketHandler={socketHandler} userId={userId}/>
            </Grid>
        </Box>
    );
}

const VideoFeeds = (props) => {
    return (
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
                        Object.keys(props.remoteStreams).map((remoteStreamId) => {
                            const remoteStream = props.remoteStreams[remoteStreamId];
                            const client = props.clients[remoteStreamId];

                            return (
                                <div key={remoteStreamId} className="video-feed">
                                    <Video remoteStream={remoteStream} muted={props.userId === remoteStreamId}/>
                                    <Typography sx={{textAlign: 'center', marginTop: '10px'}}
                                                variant={'h6'}>{client ? client.name : 'Loading...'}</Typography>
                                </div>
                            );
                        })
                    }
                </div>
            </Box>
        </Grid>
    );
}

const Video = (props) => {
    const myVideoRef = useRef(undefined);

    useEffect(() => {
        if (myVideoRef.current) {
            myVideoRef.current.srcObject = props.remoteStream;
            myVideoRef.current.muted = props.muted ? true : false;
            myVideoRef.current.addEventListener("loadedmetadata", () => { // When all the metadata has been loaded
                myVideoRef.current.play(); // Play the video
            });
            myVideoRef.current.onloadedmetadata = (e) => {
                myVideoRef.current.play();
            };
        }
    }, [myVideoRef.current]);

    return (
        <video controls={false} playsInline width="100%" height="240" id={'client id'} style={{width: '100%'}} ref={myVideoRef}/>
    );
}

const Chat = (props) => {
    const [message, setMessage] = useState('');

    // function to send a message
    const sendMessage = (message) => {
        // prevent empty message from being sent
        if (message || message.trim().length > 0) {
            if (props.socketHandler) {
                // emit message to socket server
                props.socketHandler.emit('chat-message', {
                    guid: uuidV4(),
                    socketId: props.userId,
                    message: message
                });

                // clear text field after sending message
                setMessage('');
            } else {
                console.warn('socket handler not defined, unable to send message');
            }
        }
    }

    return (
        <Grid item xs={3}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    maxHeight: '100vh',
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
                        overflowY: 'auto'
                    }}
                >
                    {
                        props.chatMessages.map((chatMessage) => {
                            const client = props.clients[chatMessage.socketId]

                            return (
                                <div
                                    key={chatMessage.guid}
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    <Typography>Name: {client ? client.name : 'Loading...'}</Typography>
                                    <Typography>Message: {chatMessage.message}</Typography>
                                    {/*grey horizontal line*/}
                                    <div style={{
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        width: '100%',
                                        height: '2px',
                                        background: '#6b6b6b'
                                    }}/>
                                </div>
                            );
                        })
                    }
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
                        <Button variant="contained" onClick={() => {
                            sendMessage(message)
                        }}>Send</Button>
                    </Box>
                </FormGroup>
            </Box>
        </Grid>
    );
}


export default VideoChatPage;