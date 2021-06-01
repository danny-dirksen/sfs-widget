import React from 'react';
import ReactDOM from 'react-dom';
import './styleReset.css';
import './style.css';
import App from './components/App.js';
import * as serviceWorker from './serviceWorker';
import common from './common.js';

let pic = common.getQueryVariable("pic")
fetch('api/links' + (pic ? "?pic=" + pic : ''))
  .then(r => r.json())
  .then(links => {
    ReactDOM.render(
      <React.StrictMode>
        <App links={links} pic={pic}/>
      </React.StrictMode>,
      document.getElementById('root')
    )
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
