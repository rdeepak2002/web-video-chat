import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

// landing page
const HomePage = () => {
    // keep track of what the user inputs (their name and meeting id)
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');

    // function to navigate between pages
    const navigate = useNavigate();

    // function called when clicking JOIN button
    const handleFormSubmission = () => {
        alert('test');
    }

    // function to return true if input fields have valid input
    const validInputs = () => {
        return userName.trim().length > 0 && roomCode.trim().length > 0;
    }

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