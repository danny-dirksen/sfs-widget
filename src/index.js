import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import App from './components/App.js';
import * as serviceWorker from './serviceWorker';
import common from './common.js';
import mixpanel from 'mixpanel-browser';

// use dev mixpanel project if in dev mode, otherwise use
//let key = process.env.BUILD_MODE.toLowerCase() = "dev" ? "f5bc3bc9c0cc47bd7ad99b2531bdd827" : ;

function isDevMode(){
    return '_self' in React.createElement('div');
}

let mixpanelKey = isDevMode() ? "f5bc3bc9c0cc47bd7ad99b2531bdd827" : "";

mixpanel.init(mixpanelKey);

let pic = common.getQueryVariable("pic")
fetch('api/links' + (pic ? "?pic=" + pic : ''))
  .then(r => r.json())
  .then(links => {
    ReactDOM.render(
      <React.StrictMode>
        <App links={links} pic={pic} mixpanel={mixpanel}/>
      </React.StrictMode>,
      document.getElementById('root')
    )
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
