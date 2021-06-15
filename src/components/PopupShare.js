import React from 'react'
import platforms from '../platforms.js'

function handleShare(platform, props) {
  props.handlers.share(platform.name)
  if (platform.name === "copy") {
    let dummy = document.createElement('input'),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }
}

function PopupShare(props) {

  return (
    <div className="pop-up-content">
      <h1 className="pop-up-header">SHARE WITH A FRIEND!</h1>
      <p className="pop-up-text">
        Word-of-mouth is how we grow. You can make an impact by spreading this resource on your favorite platforms:
      </p>
      <div id="share-buttons">
      {platforms.map((platform, index) => (
        <a href={platform.href} key={platform.name} target="_blank" rel="noopener noreferrer" onClick={handleShare(platform, props)}>
          <img src={platform.logo} alt={platform.alt} />
        </a>
      ))}
      </div>
      <p className="pop-up-text center-text">
        Message and data rates may apply.
      </p>
    </div>
  )
}

export default PopupShare
