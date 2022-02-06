import {Box, Button, FormGroup, Grid, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import qs from "qs";
import {k_video_chat_route} from "../../App";
import {k_name_search_param, k_room_code_search_param} from "../HomePage";

// keep track of possible status for clients
const k_connected_status = "connected";

// video chatting page
const VideoChatPage = () => {
    // keep track of what the user's name and the room code
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');

    // keep track of video clients
    const [clients, setClients] = useState({
            'id1': {
                socketId: 'id1',
                name: 'user a',
                status: k_connected_status
            },
            'id2': {
                socketId: 'id2',
                name: 'user b',
                status: k_connected_status
            },
            'id3': {
                socketId: 'id3',
                name: 'user c',
                status: k_connected_status
            },
            'id4': {
                socketId: 'id4',
                name: 'user d',
                status: k_connected_status
            },
    });

    // keep track of chat messages
    const [chatMessages, setChatMessages] = useState([
        {
            guid: 'guid1',
            socketId: 'id1',
            message: 'message 1'
        },
        {
            guid: 'guid2',
            socketId: 'id2',
            message: 'message 1'
        },
        {
            guid: 'guid3',
            socketId: 'id3',
            message: 'message 1'
        },
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
                <VideoFeeds clients={clients} />
                <Chat clients={clients} chatMessages={chatMessages} />
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
                                    <div key={clientId} className="video-feed">{client.name}</div>
                                );
                            }
                        })
                    }
                </div>
            </Box>
        </Grid>
    );
}

const Chat = (props) => {
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
                        <TextField id="message-input" label="Message" variant="standard" sx={{
                            flexGrow: 1
                        }}/>
                        <Button variant="contained">Send</Button>
                    </Box>
                </FormGroup>
            </Box>
        </Grid>
    );
}


export default VideoChatPage;