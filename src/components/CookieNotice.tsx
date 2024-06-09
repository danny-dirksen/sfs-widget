import React from 'react'

function CookieNotice(props) {
  return (props.allowCookies === null) ? (
    <div className="notification-container">
      <div className="notification">
        <span>We uses cookies to monitor traffic and make this tool better.</span>
        <div style={{display: "inline-block"}}>
          <button className="notification-button" onClick={() => {props.handlers.setCookies(true);}}>Okay</button>
          <button className="notification-button" onClick={() => {props.handlers.setCookies(false);}}>No Thanks</button>
        </div>
      </div>
    </div>
  ) : null;
}

export default CookieNotice
