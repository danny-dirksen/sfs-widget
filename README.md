# Project "Wildfire": a Songs for Saplings Webapp

![Video showing off the main features of the Wildfire webapp](doc/demo.gif)

## What is Project "Wildfire"?

Most artists have relatively simple discographies. For some, however, it is more complicated. The non-profit organization "Songs for Saplings" produces content in several languages, in several albums, available through several channels, and distributes it through many partners. This makes it difficult for listerners all over the world to find the content they are looking for. To solve this problem, Project Wildfire is an iframe-embeddable, cloud-hosted web app. It was based on visual and functional UX specifications, combined with plenty of back-and-forth with stakeholders on what was needed. and some mockups in the form of screenshots.

The stack has a React/Express frontend hosted on a cloud Ubuntu machine. To allow non-technical people to manage the discography efficiently, an integrated Google sheet defines the content that the app will display. Opt-in cookies, Mixpanel integration, and automated mailing integrate the app with the rest of the Songs for Saplings ecosystem.

With project Wildfire, listeners can access the content they want quickly and easily. Songs for Saplings can distribute the content they want to new listeners more easily.Finally, Songs for Saplings can now manage their discography and other content all from one place.

This webapp is primarily intended as an iframe-embeddable widget to be easily added to people's sites. However, it is also a standalone site: [music.songsforsaplings.com](https://music.songsforsaplings.com).

## How to use Project "Wildfire"

### Setup

1. Clone the repository to your local machine.
2. Install the necessary dependencies by running `npm install` in the root directory.
3. To start the development server, run `npm run backend-dev` in the root directory. Then, in another terminal, run `npm start` in the root directory.

### Deployment

The basic deployment process is as follows:

1. To build the static server, run `npm run build` in the root directory.
2. To run the server in production, run `npm install; npm run build; pm2 restart` in the root directory. The pm2 daemon will run the server in the background. Currently, it is set to run the command `npm run backend-prod`.

A workflow for deploying the backend on the current production server is still evolving, but this is the current process:

```
git checkout HEAD
git stash save --keep-index --include-untracked
git reset HEAD
git pull
git stash drop
npm run build
pm2 restart app
```

### Credits

Created by Daniel Dirksen.

© Songs for Saplings 2021. All rights reserved.
