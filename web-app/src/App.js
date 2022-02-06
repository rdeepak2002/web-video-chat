import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import VideoChatPage from "./component/VideoChatPage";
import HomePage from "./component/HomePage";
import {createTheme, ThemeProvider} from "@mui/material";

export const k_home_route = "/home";
export const k_video_chat_route = "/meet";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3F51B5',
        }
    },
});

const App = () => {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Routes>
                    <Route path={k_home_route} element={<HomePage/>}/>
                    <Route path={k_video_chat_route} element={<VideoChatPage/>}/>
                    <Route path="*" element={<Navigate to={k_home_route}/>}/>
                </Routes>
            </ThemeProvider>
        </Router>
    );
}

export default App;
