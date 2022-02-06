import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import VideoChatPage from "./component/VideoChatPage";
import HomePage from "./component/HomePage";

export const k_home_route = "/home";
export const k_video_chat_route = "/meet";

const App = () => {
  return (
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Routes>
            <Route path={k_home_route} element={<HomePage />} />
            <Route path={k_video_chat_route} element={<VideoChatPage />} />
            <Route path="*" element={<Navigate to={k_home_route}/>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
