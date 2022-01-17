# web-video-chat

## About

Tutorial on how to create a Zoom 'clone' in the web

## Author

Deepak Ramalingam

## Prerequisites (windows)

Before following this tutorial, please understand how to use the 'dir', 'cd', and 'mkdir' commands in your terminal application.

List of terminal commands for Windows:
- https://www.thomas-krenn.com/en/wiki/Cmd_commands_under_Windows

## Prerequisites (macOS / linux)

Before following this tutorial, please understand how to use the 'ls', 'cd', and 'mkdir' commands in your terminal application.

List of terminal commands for macOS / Linux:
- https://dev.to/kymiddleton/reference-guide-common-commands-for-terminal-6no

## Software Required (Windows)
- Install Node.js: https://nodejs.org/en/download/
- IDE (install one of the following):
  - Recommended: https://www.jetbrains.com/webstorm/download/#section=windows
    - Apply for a free license for students using this link: https://www.jetbrains.com/community/education/#students
  - Other: https://code.visualstudio.com/
- Install git on Windows: https://git-scm.com/download/win

## Software Required (Linux)
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

## Software Required (macOS)
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

## Part 00 - Project Setup

Note: for Windows, use 'dir' instead of 'ls'

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
npx create-react-app web-app
cd web-app
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
