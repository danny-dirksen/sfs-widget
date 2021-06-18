import React from 'react'

function Header(props) {
  return (
    <a
      id={props.data.id}
      className="branding-container"
      href={props.data.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => props.handleWebsite()}
    >
      {props.data.src ?
        <img className="branding" alt={props.data.alt} src={props.data.src} /> :
        <div className="branding">{props.data.alt}</div>
      }

    </a>
  )
}

export default Header
