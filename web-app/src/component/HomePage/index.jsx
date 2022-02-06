import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {createSearchParams, useNavigate} from "react-router-dom";
import {useState} from "react";
import {k_video_chat_route} from "../../App";

// constants to keep track of
export const k_name_search_param = 'name';
export const k_room_code_search_param = 'room-code';

// landing page
const HomePage = () => {
    // keep track of what the user inputs (their name and meeting id)
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');

    // function to navigate between pages
    const navigate = useNavigate();

    // function called when clicking JOIN button
    const handleFormSubmission = () => {
        // create the search params
        // ex search params: "name=deepak&room-code=abc123" from http://localhost:3000/meet?name=deepak&room-code=abc123
        const searchParms = createSearchParams([
            [k_name_search_param, userName],
            [k_room_code_search_param, roomCode]
        ]);

        // then navigate to this new url which has the user's name and their inputted room code
        // ex url: http://localhost:3000/meet?name=deepak&room-code=abc123
        navigate({
            pathname: k_video_chat_route,
            search: `?${searchParms}`,
        });
    }

    // function to return true if input fields have valid input
    const validInputs = () => {
        return userName.trim().length > 0 && roomCode.trim().length > 0;
    }

    // render the page
    return (
        // Container for this page
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
            {/*Encapsulate all items in a grid so we can specify spacing between them*/}
            <Grid container direction={"column"} spacing={7} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {/*Video Chat text at top of page*/}
                <Grid item>
                    <Typography variant={'h2'}>Video Chat</Typography>
                </Grid>

                {/*Text field for inputting name*/}
                <Grid item>
                    <TextField id="name-input" label="Name" variant="standard" type={"text"} value={userName}
                               onChange={(event) => {
                                   // function called when input field is changed
                                   setUserName(event.target.value);
                               }}/>
                </Grid>

                {/*Text field for inputting meeting id*/}
                <Grid item>
                    <TextField id="meeting-id-input" label="Room Code" variant="standard" type={"text"} value={roomCode}
                               onChange={(event) => {
                                   // function called when input field is changed
                                   setRoomCode(event.target.value);
                               }}/>
                </Grid>

                {/*Button for joining a meeting after inputting the above information*/}
                <Grid item>
                    <Button variant="contained" type="submit" onClick={() => handleFormSubmission()}
                            disabled={!validInputs()}>
                        <Typography variant={'body1'}>JOIN</Typography>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default HomePage;