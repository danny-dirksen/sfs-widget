import React from 'react'

function PopupInfo(props) {
  let resource = props.resourceInfo.find(res => res.id === props.client.resource)
  return (
    <div className="pop-up-content">
      <h1 className="pop-up-header">{resource.line2}</h1>
      <p className="pop-up-text">{resource.info}</p>
      <p className="pop-up-text">
        Thanks for your interest in our music. Using these links you can learn about <a href="https://songsforsaplings.com/resources/" target="_blank" rel="noopener noreferrer"> our other free resources</a>, how to <a href="https://songsforsaplings.com/freemusic/" target="_blank" rel="noopener noreferrer">share this music</a> with your friends and church for free, or how to <a href="https://songsforsaplings.com/contact/" target="_blank" rel="noopener noreferrer">get in touch</a> with Songs for Saplings.
      </p>
    </div>
  )
}

export default PopupInfo
