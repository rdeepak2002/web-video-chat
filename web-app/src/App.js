import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import VideoChatPage from "./component/VideoChatPage";
import HomePage from "./component/HomePage";
import {createTheme, ThemeProvider} from "@mui/material";

// constants to keep track of url routes
export const k_home_route = "/home";
export const k_video_chat_route = "/meet";

// setup dark theme for app
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3F51B5',
        },
        background: {
            default: '#343434',
            darker: '#232323',
            darkest: '#151515'
        }
    },
});

// setup routes and theme for app
const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                {/* A <Router> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Routes>
                    <Route path={k_home_route} element={<HomePage/>}/>
                    <Route path={k_video_chat_route} element={<VideoChatPage/>}/>
                    <Route path="*" element={<Navigate to={k_home_route}/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
