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
  - Recommended: https://www.jetbrains.com/webstorm/download/#section=mac
    - Apply for a free license for students using this link: https://www.jetbrains.com/community/education/#students
  - Other: https://code.visualstudio.com/
- Install git on Windows: https://git-scm.com/download/win

## Software Required (Linux)
- Install Node.js: https://nodejs.org/en/download/
- IDE (install one of the following):
  - Recommended: https://www.jetbrains.com/webstorm/download/#section=mac
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

## Part 0 - Project Setup (macOS / Linux)

How I setup the skeleton for the project:

```shell
# I first created a new folder called 'Projects' in my 'Documents' folder
ls                # 'ls' allows me to see where I am
cd Documents
mkdir Projects
cd Projects

# I then create another new folder called 'web-video-chat'
mkdir web-video-chat
cd web-video-chat

# In here, we will create a folder called 'server' for all our Node.js server
# And we will create another folder called 'web-app' for our React web application code


```
