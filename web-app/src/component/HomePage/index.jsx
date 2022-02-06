import {Box, Typography} from "@mui/material";

const HomePage = () => {
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
            <Typography>Home Page</Typography>
        </Box>
    );
}

export default HomePage;