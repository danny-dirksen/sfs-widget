import React from 'react';
import OptionButtons from './OptionButtons.js';

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
          <div className="dropdown-option" key={index}>
            <div style={{flex: 1, textAlign: "center", height: "100%"}}>
              <p
                role="button"
                className="dropdown-text"
                onClick={() => props.handlers.selectLanguage(language.name)}
                tabIndex="0"
              >{autonym}</p>
            </div>
            <OptionButtons data={{id: language.name}} handlers={props.handlers} />
          </div>
        )
      })
    }
  }
  return (
    <div className="dropdown" id="dropdown-language" style={{visibility: visible ? "visible" : "hidden"}}>{cards}</div>
  )


}

export default DropdownLanguage
