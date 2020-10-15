import React from 'react'
import platforms from '../platforms.js'



function PopupShare(props) {

  return (
    <div className="pop-up-content">
      <h1 className="pop-up-header">SHARE WITH A FRIEND!</h1>
      <p className="pop-up-text">
        Word-of-mouth is how we grow. You can make an impact by spreading this resource on your favorite platforms:
      </p>
      <div id="share-buttons">
        {platforms.map((platform, index) => (
          <a href={platform.href} key={platform.name} target="_blank" rel="noopener noreferrer" onClick={() => props.handlers.share(platform.name)}>
            <img src={platform.logo} alt={platform.alt} />
          </a>
        ))}
      </div>
    </div>
  )
}

export default PopupShare
