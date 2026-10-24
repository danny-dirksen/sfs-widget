# music.songsforsplings.com: a Songs for Saplings Webapp

[music.songsforsplings.com](music.songsforsplings.com) is an open-source webapp created to get Songs for Saplings music to the world.

**Browsing**: Quickly find music on any platform, in any language, on any device.

![Video demo of main features](doc/1-demo-browsing.gif)

**Partner Percs**: Our church partners easily embed the app in their own website, giving their members exclusive access content and resources for free.

![Video demo of partner](doc/2-partner-percs.gif)

**Any Device**: The app is fully responsive, supporting all devices, including tiny embedds.

![Video demo of main features](doc/3-flexible.gif)

**Performance**: The app is fast, with a 100% Lighthouse performance score.

![Video demo of main features](doc/4-performance.png)

## What is music.songsforsplings.com?

Most artists have relatively simple discographies. However, when content comes in several languages, in several albums, available through several channels, and distributes it through many partners, it becomes difficult for audiences from all over the world to find the content they are looking for. To solve this problem, Songs for Saplings now offers an iframe-embeddable, cloud-hosted web app for navigating their discography.

The stack has a React/NextJS frontend deployed to DigitalOcean Droplet. To allow non-technical people to manage the discography efficiently, an integrated Google sheet defines the content that the app will display. Opt-in cookies, Mixpanel integration, and automated mailing integrate the app with the rest of the Songs for Saplings ecosystem.

With music.songsforspalings.com, listeners can access the content they want quickly and easily. Songs for Saplings can distribute the content they want to new listeners more easily.Finally, Songs for Saplings can now manage their discography and other content all from one place.

This webapp is primarily intended as an iframe-embeddable widget to be easily added to people's sites. However, it is also a standalone site: [music.songsforsaplings.com](https://music.songsforsaplings.com).

## How to run the app

### Setup

1. Clone the repository to your local machine.
2. Install the necessary dependencies by running `npm ci` in the root directory.
3. To start the development server, run `npm run dev` in the root directory.

Node.js 24 or newer is required for development, tests, builds, and production. The Node.js type definitions target v24.

### Testing

Run `npm test` for unit tests. Run `npm run test:integration` for the Google Sheets integration tests, which require the credentials and spreadsheet configuration described in `.env-example`.

Both test configurations transform the ESM-only `ky` dependency used by `google-spreadsheet`, along with `gaxios` and its ESM fetch dependencies used during Google authentication, so they can run in Jest's CommonJS environment.

### Deployment

Pushing changes to `main` runs the unit tests on Node.js 24 in GitHub Actions before deploying to production. You can also deploy manually with `npm run deploy`.

### Credits

Created by the Songs for Saplings team.

Developed by Daniel Dirksen.

© Songs for Saplings 2024. All rights reserved.
