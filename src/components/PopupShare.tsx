import React from 'react'
import getPlatforms from '../getPlatforms.js'



function PopupShare(props) {

  const [copied, setCopied] = React.useState(false);

  function handleShare(platform) {
    props.handlers.share(platform.name, platform.name === 'copy');
    if (platform.name === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {setCopied(false)}, 2000)

      // ^ the commented statement above creates an infinite loop of this function being called. I am not sure what causes this.
    }

  }
  let platforms = getPlatforms();

  return (
    <div className='pop-up-content'>
      <h1 className='pop-up-header'>SHARE WITH A FRIEND!</h1>
      <p className='pop-up-text'>
        Word-of-mouth is how we grow. You can make an impact by spreading this resource on your favorite platforms:
      </p>
      <div id='share-buttons'>
        {platforms.map((platform, index) => (
          <a href={platform.href} key={platform.name} target='_blank' rel='noopener noreferrer' onClick={() => {handleShare(platform)}}>
            <img src={platform.logo} alt={platform.alt} />
            <div>{ platform.name === 'copy' && copied ?
              'Copied!' : // TODO: make copied change when you click copy.
              platform.alt
            }</div>
          </a>
        ))}
      </div>
      <p className='pop-up-text center-text'><small>
        Message and data rates may apply.
      </small></p>
    </div>
  );
}

export default PopupShare
