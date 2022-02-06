import {Box, Button, FormGroup, Grid, TextField, Typography} from "@mui/material";
import {createRef, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import qs from "qs";
import {k_video_chat_route} from "../../App";
import {k_name_search_param, k_room_code_search_param} from "../HomePage";
import socketIOClient from "socket.io-client";
import { v4 as uuidV4 } from 'uuid';
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
    // const [peerHandler, setPeerHandler] = useState(undefined);

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
    const { search } = useLocation();

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
        if(!nameFromSearch || nameFromSearch.length <= 0 || !roomCodeFromSearch || roomCodeFromSearch.length <= 0) {
            navigate(k_video_chat_route);
            return;
        }

        // otherwise if everything is valid and we were able to get the search params, store these as variables
        setUserName(nameFromSearch);
        setRoomCode(roomCodeFromSearch);
    }, [search]);

    const addVideoStream = (remoteStream) => {
        // if(!myVideoRef.current) {
        console.log('adding video stream for peer', remoteStream.id);
        const remoteStreamsCopy = remoteStreams;
        remoteStreamsCopy[remoteStream.id] = remoteStream;
        setRemoteStreams(Object.assign({}, remoteStreamsCopy));
    }

    useEffect(() => {
        if(userId && userName) {
            // setup peer connection
            const peer = new Peer(userId, {
                // host: "web-video-chat-peer-server-v2.herokuapp.com",
                'iceServers': [
                    { url: 'stun:stun.l.google.com:19302' },
                    { url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username:'web...@live.com' },
                    { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username:'web...@live.com' },
                    { url: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
                    { url: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' }
                ]
            })

            // setup socket connection
            const socket = process.env.REACT_APP_ENV === "PRODUCTION" ?  socketIOClient(API_ENDPOINT, {secure: true}) : socketIOClient(API_ENDPOINT, {secure: true});

            // function to call other peers
            const callPeer = ( id ) =>
            {
                navigator.mediaDevices.getUserMedia({ video : true , audio : true })
                    .then(  (stream) => {
                        // TODO: this is our own video - display it?
                        // addVideoStream(stream);
                        console.log('our video stream we will send', stream);

                        // attempt to call the other person with this stream
                        let call = peer.call(id, stream);

                        call.on('stream' , (remoteStream) => {
                            // TODO: this is the video of the new peer - display it?
                            console.log('stream from person I called', remoteStream);
                            addVideoStream(remoteStream);
                        });
                    })
                    .catch( (e)=>{
                        console.log('error1' , e );
                    });
            }

            // setup peer listeners
            // peer connection opens
            peer.on('open', (myPeerId) => {
                // inform other clients about your peer id
                console.log('my peer id', myPeerId);
                socket.emit('peer-id-offer' , { id : myPeerId}); // send your peerid to other users in the room via socket.io
            });

            // handle receiving call from other clients in the room
            peer.on('call' , (call) => {
                // send your own stream for the caller and add the caller stream to your page
                navigator.mediaDevices.getUserMedia({ video : true , audio : true })
                    .then((stream) => {
                        // TODO: this is our own video - display it?
                        // addVideoStream(stream);
                        console.log('our video stream we will respond with', stream);

                        call.answer(stream);
                        call.on('stream' , (remoteStream) => {
                            // TODO: handle receiving video call from someone else
                            console.log('stream from person who called me', remoteStream);
                            addVideoStream(remoteStream);
                        })

                    })
                    .catch( (e)=>{
                        console.log('error2' , e );
                    });
            })

            // setup socket listeners
            // listener for new peerjs id
            socket.on('peer-id-received', (data) => {
                const newPeerId = data.id;
                console.log('received peer id', newPeerId);
                callPeer(newPeerId);
            });

            // listener for chat messages
            socket.on("chat-message", (data) => {
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
                    {/*<div key={'something'} className="video-feed">*/}
                    {/*    <Typography>{'other person'}</Typography>*/}
                    {/*    <Typography>{'other client id'}</Typography>*/}
                    {/*    /!*<Video remoteStream={}/>*!/*/}
                    {/*    /!*<video id={'client id'} style={{width: '100%'}} ref={el => props.myVideoRef.current[clientId] = el} />*!/*/}
                    {/*</div>*/}
                    {
                        Object.keys(props.remoteStreams).map((remoteStreamId) => {
                            const remoteStream = props.remoteStreams[remoteStreamId];

                            // if(clientId !== props.userId)

                            return (
                                <div key={remoteStreamId} className="video-feed">
                                    <Typography>{remoteStreamId}</Typography>
                                    <Video remoteStream={remoteStream}/>
                                    {/*<video id={'client id'} style={{width: '100%'}} ref={el => props.myVideoRef.current[clientId] = el} />*/}
                                </div>
                            );
                        })
                    }
                    {
                        Object.keys(props.clients).map((clientId) => {
                            const client = props.clients[clientId];

                            // if(clientId !== props.userId)

                            if(client.status === k_connected_status) {
                                return (
                                    <div key={clientId} className="video-feed">
                                        <Typography>{client.name}</Typography>
                                        <Typography>{clientId}</Typography>
                                        <video id={clientId} style={{width: '100%'}} ref={el => props.myVideoRef.current[clientId] = el} />
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </Box>
        </Grid>
    );
}

const Video = (props, muted=true) => {
    const myVideoRef = useRef(undefined);

    useEffect(() => {
        if(myVideoRef.current) {
            myVideoRef.current.srcObject = props.remoteStream;
            myVideoRef.current.muted = muted;
            myVideoRef.current.addEventListener("loadedmetadata", () => { // When all the metadata has been loaded
                myVideoRef.current.play(); // Play the video
            });
            myVideoRef.current.onloadedmetadata = (e) => {
                myVideoRef.current.play();
            };
        }
    }, [myVideoRef.current]);

    return (
        <video controls width="640" height="240" id={'client id'} style={{width: '100%'}} ref={myVideoRef} />
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
            else {
                console.warn('socket handler not defined, unable to send message');
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
                                // const client = props.clients[chatMessage.socketId]

                                return (
                                    <Box
                                        key={chatMessage.guid}
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        <Typography>Name: {chatMessage.socketId}</Typography>
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