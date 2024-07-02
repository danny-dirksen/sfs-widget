# Project "Wildfire": a Songs for Saplings Webapp

![Video showing off the main features of the Wildfire webapp](doc/demo.gif)

## What is Project "Wildfire"?

Most artists have relatively simple discographies. However, when content comes in several languages, in several albums, available through several channels, and distributes it through many partners, it becomes difficult for audiences from all over the world to find the content they are looking for. To solve this problem, Project Wildfire is an iframe-embeddable, cloud-hosted web app. It was based on visual and functional UX specifications, combined with plenty of back-and-forth with stakeholders on what was needed. and some mockups in the form of screenshots.

The stack has a React/Express frontend hosted on a cloud Ubuntu machine. To allow non-technical people to manage the discography efficiently, an integrated Google sheet defines the content that the app will display. Opt-in cookies, Mixpanel integration, and automated mailing integrate the app with the rest of the Songs for Saplings ecosystem.

With project Wildfire, listeners can access the content they want quickly and easily. Songs for Saplings can distribute the content they want to new listeners more easily.Finally, Songs for Saplings can now manage their discography and other content all from one place.

This webapp is primarily intended as an iframe-embeddable widget to be easily added to people's sites. However, it is also a standalone site: [music.songsforsaplings.com](https://music.songsforsaplings.com).

## How to use Project "Wildfire"

### Setup

1. Clone the repository to your local machine.
2. Install the necessary dependencies by running `npm install` in the root directory.
3. To start the development server, running `npm run dev` in the root directory.

### Deployment

After pushing changes to `main`, you can deploy to production by entering the command `npm run deploy` on your local machine.

### Credits

Created by Daniel Dirksen.

© Songs for Saplings 2021. All rights reserved.
