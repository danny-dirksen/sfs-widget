import React from 'react'
import OptionButtons from '../OptionButtons.jsx';
import Back from '../BackButton.jsx'

let cards = []

function DropdownResource(props) {

  let visible = (props.client.page === 3);

  if (visible) {
    cards = [];
    // the attributes of the selected language which depend on the channel
    let channel = props.links.channels.find(channel => {
      return channel.name.toLowerCase() === props.client.channel.toLowerCase()
    });
    if (channel) {
      let language = channel.languages.find(language => {
        return language.name.toLowerCase() === props.client.language.toLowerCase()
      })
      // the attributes of the selected language which are independent of the channel.
      let languageData = props.links.languages.find(langData => {
        return langData.name.toLowerCase() === props.client.language.toLowerCase()
      })
      // for each resource, or 'album'
      language.resources.forEach((resource, index) => {
        // finds description and info about the resource. independent of the channel selected.
        let resourceData = languageData.resources.find(recData => {
          return (recData.id === resource.id)
        })
        if (resourceData) {
          let innerText = (
            <React.Fragment>
              <div><small>{resourceData.line1}</small></div>
              <div className='green-text'>{resourceData.line2}</div>
            </React.Fragment>
          );
          cards.push(
            <div
              className={`dropdown-option${props.client.focused === resource.id ? ' focused' : ''}`}
              key={index}
            >
              { props.client.channel.toLowerCase() === 'download' ?
                <div
                  className='dropdown-text'
                  onClick={() => props.handlers.downloadScreen(resource.id)}
                  role='button'
                  tabIndex='0'
                  disabled={props.client.page !== 3 ? true : ''}
                >
                  {innerText}
                </div> :
                <a
                  className='dropdown-text'
                  href={resource.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => props.handlers.selectResource(resource.id)}
                  tabIndex='0'
                >
                  {innerText}
                </a>
              }
              { !resource.shared &&
                <OptionButtons data={{id: resource.id}} handlers={props.handlers} />
              }
            </div>
          )
        }
      })
    }
  }
  let style = {
    visibility: visible ? 'visible' : 'hidden'
  };
  return (
    <div className='dropdown' id='dropdown-resource' style={style}>
      <Back handleBack={props.handlers.back} />
      {cards}
    </div>
  )
}

export default DropdownResource
