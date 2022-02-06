# web-video-chat

## About

Tutorial on how to create a Zoom 'clone' in the web

## Author

Deepak Ramalingam

## Table of Contents

1. [ Part 00 - Mockup and Frontend Setup ](#part00)
2. [ Part 01 - Software Setup ](#part01)
3. [ Part 02 - Project Setup ](#part02)
4. [ Part 03 - React Router Setup ](#part03)
5. [ Part 04 - Implementing Our Mockup ](#part04)

<a name="part00"></a>
## Part 00 - Mockup and Frontend Setup
Goal: Create a rough mockup of your web app in Figma (https://www.figma.com/)

Example: https://www.figma.com/file/MXK5OCYonbfN5staFvhB13/Video-Chat?node-id=0%3A1

Tips:
- To create a screen, just create a big rectangle
- You can copy and paste elements (buttons, text fields, etc.) from other Figma projects like these ones: 
  - https://www.figma.com/file/9bhIrgZ7ubfDID7NLCq4Ld/MUI-for-Figma-v5.0.1-(Free)-(Community)?node-id=4408%3A773
  - https://www.figma.com/file/9bhIrgZ7ubfDID7NLCq4Ld/MUI-for-Figma-v5.0.1-(Free)-(Community)?node-id=4213%3A8332
  - https://www.figma.com/file/9bhIrgZ7ubfDID7NLCq4Ld/MUI-for-Figma-v5.0.1-(Free)-(Community)
- You can group multiple items together by command / control clicking on them, then right click and press 'group'

<a name="part01"></a>
## Part 01 - Software Setup

Goal: Install the necessary software and development tools on your computer

### Prerequisites (windows)

Before following this tutorial, please understand how to use the 'dir', 'cd', 'rmdir', and 'mkdir' commands in your terminal application.

List of terminal commands for Windows:
- https://www.thomas-krenn.com/en/wiki/Cmd_commands_under_Windows

### Prerequisites (macOS / linux)

Before following this tutorial, please understand how to use the 'ls', 'cd', 'rm', and 'mkdir' commands in your terminal application.

List of terminal commands for macOS / Linux:
- https://dev.to/kymiddleton/reference-guide-common-commands-for-terminal-6no

### Software Required (Windows)
- Install Node.js: https://nodejs.org/en/download/
- IDE (install one of the following):
  - Recommended: https://www.jetbrains.com/webstorm/download/#section=windows
    - Apply for a free license for students using this link: https://www.jetbrains.com/community/education/#students
  - Other: https://code.visualstudio.com/
- Install git on Windows: https://git-scm.com/download/win

### Software Required (Linux)
- Install Node.js: https://nodejs.org/en/download/
- IDE (install one of the following):
  - Recommended: https://www.jetbrains.com/webstorm/download/#section=linux
    - Apply for a free license for students using this link: https://www.jetbrains.com/community/education/#students
  - Other: https://code.visualstudio.com/
- Run the following command in your terminal application to install git on Linux:
```shell
sudo apt-get update
sudo apt install git-all
```

### Software Required (macOS)
- Install Node.js: https://nodejs.org/en/download/
- IDE (install one of the following):
  - Recommended: https://www.jetbrains.com/webstorm/download/#section=mac
    - Apply for a free license for students using this link: https://www.jetbrains.com/community/education/#students
  - Other: https://code.visualstudio.com/
- Run the following command in your terminal application to install git on macOS:
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install git
```

Run the following command in your terminal after installing Node.js on macOS:

```shell
sudo chown -R $USER /usr/local/lib/
sudo chown -R $USER /usr/local/lib/node_modules/
sudo chown -R $USER /usr/local/bin/
sudo chown -R $USER /usr/local/share/
```

<a name="part02"></a>
## Part 02 - Project Setup (https://youtu.be/UdC2CUp6if8)

Goal: Create the skeleton for this project (folder for server code and folder for website code) and push the code to GitHub

Video: https://youtu.be/UdC2CUp6if8

Note: For Windows, use 'dir' instead of 'ls', and 'rd /s /q' instead of 'rm -rf'

How to setup the skeleton for the project:

```shell
# I first created a new folder called 'Projects' in my 'Documents' folder
ls                # 'ls' allows us to see where we are
cd Documents
mkdir Projects
cd Projects

# I then create another new folder called 'web-video-chat'
mkdir web-video-chat
cd web-video-chat

# In here, we will create a folder called 'server' for all our Node.js server
# And we will create another folder called 'web-app' for our React web application code

# first, we will create a blank npm project for the server application
mkdir server
cd server
npm init -y
# its good practice to add a '.gitignore' file so that git does not push folders like 'node_modules'
# download this file and add it to this server folder: https://raw.githubusercontent.com/rdeepak2002/web-video-chat/main/server/.gitignore

# leave this folder
cd ..

# then, we will create the web application
npx create-react-app web-app -y
cd web-app
# remove current git repo inside
rm -rf .git
# optional: running 'npm start' will make the web app run
# press 'control + c' in your terminal application to terminate the process
npm start

# leave this folder
cd ..
```

How to push this code to git:

- Create an account at https://github.com/
- Go to the 'Repositories' section and click 'New' / 'Create'
  - Type in a name for the repository
  - Click 'Create Repository'
- Run the following terminal commands:

```shell
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/[REPO_NAME].git
git push -u origin main
```

- If you are asked to login, type in your username and for the password, generate a new token using this link: https://github.com/settings/tokens/new
  - Select all the scopes
  - Paste in the token string as your password

How to push new code to git:

```shell
# in the root directory of your project, run the following terminal commands
git add .
git commit -m "some commit message"
git push -u origin main
```

<a name="part03"></a>
## Part 03 - React Router Setup

First, we will add routing to our website. 

Example of routing:
- https://www.website.com/features/ shows the "features" page
- https://www.website.com/website-templates/ shows the "website-templates" page

A popular library for implementing routing in React is the React Router library: https://reactrouter.com/docs/en/v6/getting-started/tutorial

To install it, run the following command in your web-app folder:

```shell
cd web-app
npm install react-router-dom --save
```

Then modify the content of "src/App.js" to have two routes (one for our home page and another for the video chat page):

```jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

export const k_home_route = "/home";
export const k_video_chat_route = "/meet";

const HomePage = () => {
  return (
          <div>
            Hello world from home page
          </div>
  );
}

const VideoChatPage = () => {
  return (
          <div>
            Hello world from video chat page
          </div>
  );
}

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
```

Run the app using "npm start" in the web-app folder.

Notice the following:
- http://localhost:3000/home will show us the home page
- http://localhost:3000/meet will show us the video chat page
- We added a "Navigate" element at the end of Routes to have the website redirect to the home page if the URL is not recognized
  - Ex: http://localhost:3000/asdf will redirect to http://localhost:3000/home

After this, we will move the "HomePage" and "VideoChatPage" components to separate files.

Create a new file in web-app/src/component/HomePage called "index.jsx" with the following content:

```jsx
const HomePage = () => {
    return (
        <div>
            Hello world from home page
        </div>
    );
}

export default HomePage;
```

Create a new file in web-app/src/component/VideoChatPage called "index.jsx" with the following content:

```jsx
const VideoChatPage = () => {
  return (
          <div>
            Hello world from video chat page
          </div>
  );
}

export default VideoChatPage;
```

Modify App.js to refer to these new files:

```jsx
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
```

Good job, you set up routing on your website!

<a name="part04"></a>
## Part 04 - Implementing our Mockup

To start implementing our Mockup (https://www.figma.com/file/MXK5OCYonbfN5staFvhB13/Video-Chat?node-id=0%3A1), we will first install a UI library.

UI libraries make it easier to develop since we do not have to write our own custom CSS.

Popular UI libraries include Bootstrap (https://getbootstrap.com/) and Material UI (https://mui.com/)

For this tutorial, I will be using Material UI. To install, it run the following terminal command in the web-app folder.

```shell
cd web-app
npm install @mui/material @emotion/react @emotion/styled --save
```

First, we will fix some of the CSS (styling) for our webpage. Replace web-app/src/index.css with the following:

```css
body {
  margin: 0;
  background: black;
}

#root {
  height: 100%;
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
}
```

This will make our webpage take up the entire width and height of the screen.

Then, we will add a Material UI Theme to our application. This will make it so that coloring and styles can be consistent throughout our app. We can even setup a system to switch between dark mode and light mode. 

Modify web-app/src/App.js to wrap the entire application with a ThemeProvider component:

```js
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import VideoChatPage from "./component/VideoChatPage";
import HomePage from "./component/HomePage";
import {createTheme, ThemeProvider} from "@mui/material";
import {green, purple} from "@mui/material/colors";

export const k_home_route = "/home";
export const k_video_chat_route = "/meet";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: purple[500],
        },
        secondary: {
            main: green[500],
        },
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
```

Modify web-app/src/component/HomePage/index.jsx to use this theme:

```jsx
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
```

Modify web-app/src/component/VideoChatPage/index.jsx to use this theme:

```jsx
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
```

Now, we should see the Home Page and Video Chat Pages having a black background with white text.

After this, we will implement our mockup. 

We will also use some basic React code to have the Home Page navigate to the Video Chat Page and pass along the inputted data via the url. 

We will also use the 'qs' library to parse data from the URL. Install it with the following commands:

```shell
cd web-app
npm install qs --save
```

This is what web-app/src/App.js looks like:

```js

```

This is what web-app/src/component/HomePage/index.jsx looks like:

```jsx

```

This is what web-app/src/component/VideoChatPage/index.jsx looks like:

```jsx

```

This is what index.css looks like:
```css

```