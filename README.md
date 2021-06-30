# Songs for Saplings Webapp "Wildfire"
Project "Wildfire" is a service that makes it easy to find all Songs for Saplings resources. It is primarily intended as an iframe-embeddable widget to be easily added to people's sites. However, it is also a [standalone site](music.songsforsaplings.com).
The frontend is built with ReactJS and served statically, with a backend api handling requests and supplying live data about what resources are available.
The backend uses nodeJS through a PM2 daemon on a linux Digitalocean droplet running NGINX with encryption enabled through Certbot.

Notes on using this repo:
- Node.js dependencies must be installed in order to run this node server. Simply go to the root directory and type `npm install` while in the root directory. If you do not have npm, you can learn more about it [Here](https://www.npmjs.com/)
- For full list of ReactJS commands, see `REACT-README.md`.
- To build the static server, go to the root directory and use the command `npm run-script build`. The resulting build file will be used directly by the backend.
- To run the server in production, go to the repo root directory and use the command `npm install; npm run build; pm2 restart`
- The pm2 daemon was created to run the command `npm run backend-prod` in the background.
- The front end relies on the backend, even when using a dev build. To run the frontend and backend simultaneously during development, go to the repository's root (`sfs-widget`) directory and use the command `npm run backend-dev`. In another terminal, use the command `npm start`.

Notes on the backend:
- A workflow for deploying the backend on the current production server is still evolving, but this is the current process:
`git checkout HEAD
git stash save --keep-index --include-untracked
git reset HEAD
git pull
git stash drop
npm run build
pm2 restart app`
- if build script or app are not working, make sure npm dependencies are installed with `npm install`
- [This Stack overflow thread](https://stackoverflow.com/questions/52704/how-do-i-discard-unstaged-changes-in-git) has come in handy for git-related issues.

Created by Daniel Dirksen with help from Andrew Dirksen and guidance from James Dirksen, serving music and resources created by Dana Dirksen

Copywrite Songs for Saplings 2021. All rights reserved.
