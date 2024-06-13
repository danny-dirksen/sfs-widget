import React from 'react';
import OptionButtons from './OptionButtons.jsx';
import Back from './Back.jsx'

let cards = []

function DropdownLanguage(props) {

  let visible = (props.client.page === 2);

  if (visible) {
    cards = [];

    let channel = props.links.channels.find(channel => {
      return channel.name.toLowerCase() === props.client.channel.toLowerCase()
    });
    if (channel) {
      channel.languages.forEach((language, index) => {
        let autonym = props.links.languages.find(lang => lang.name === language.name).autonym
        cards.push(
          <div
            className={`dropdown-option${props.client.focused === language.name ? ' focused' : ''}`}
            key={index}>
            <div className='dropdown-text-centerer'
              role='button'
              onClick={() => props.handlers.selectLanguage(language.name)}
              tabIndex='0'>
              <span className='dropdown-text'>{autonym}</span>
            </div>
            <OptionButtons data={{id: language.name}} handlers={props.handlers} />
          </div>
        )
      })
    }
  }
  return (
    <div className='dropdown' id='dropdown-language' style={{visibility: visible ? 'visible' : 'hidden'}}>
      <Back handleBack={props.handlers.back} />
      {cards}
    </div>
  )


}

export default DropdownLanguage
