import {Box, Typography} from "@mui/material";

const VideoChatPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                color: 'text.primary'
            }}
        >
            <Typography>Video Chat Page</Typography>
        </Box>
    );
}

export default VideoChatPage;