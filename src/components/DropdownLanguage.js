import React from 'react'

let cards = []

function DropdownLanguage(props) {

  let visible = (props.client.page === 2)

  if (visible) {
    cards =[]

    let channel = props.links.channels.find(channel => {
      return channel.name.toLowerCase() === props.client.channel.toLowerCase()
    })
    if (channel) {
      channel.languages.forEach((language, index) => {
        let autonym = props.links.languages.find(lang => lang.name === language.name).autonym
        cards.push(
          <button
            className="dropdown-option"
            key={index}
            onClick={() => props.selectLanguage(language.name)}
            tabIndex="0"
          >
            <p className="dropdown-text">{autonym}</p>
          </button>
        )
      })
    }
  }
  return (
    <div className="dropdown" id="dropdown-language" style={{visibility: visible ? "visible" : "hidden"}}>{cards}</div>
  )
}

export default DropdownLanguage
