import React from 'react'
import infoIcon from '../resources/ui/info.svg'
import shareIcon from '../resources/ui/share.svg'

let cards = []

function DropdownResource(props) {

  let visible = (props.client.page === 3)

  if (visible) {
    cards = []
    // the attributes of the selected language which depend on the channel
    let channel = props.links.channels.find(channel => {
      return channel.name.toLowerCase() === props.client.channel.toLowerCase()
    })
    if (channel) {
      let language = channel.languages.find(language => {
        return language.name.toLowerCase() === props.client.language.toLowerCase()
      })
      // the attributes of the selected language which are independent of the channel.
      let languageData = props.links.languages.find(langData => {
        return langData.name.toLowerCase() === props.client.language.toLowerCase()
      })
      // for each resource, or "album"
      language.resources.forEach((resource, index) => {
        // finds description and info about the resource. independent of the channel selected.
        let resourceData = languageData.resources.find(recData => {
          return recData.id === resource.id
        })
        cards.push(
          <div className="dropdown-option" key={index}>
            { props.client.channel.toLowerCase() === "download" ?
              <div
                className="dropdown-text"
                onClick={() => props.handlers.downloadScreen(resource.id)}
                role="button"
                tabIndex="0"
                disabled={props.client.page !== 3 ? true : ""}
              >
                <div>{resourceData.line1}</div>
                <div className="big-green">{resourceData.line2}</div>
              </div> :
              <a
                className="dropdown-text"
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => props.handlers.selectResource(resource.id)}
                tabIndex="0"
              >
                <div>{resourceData.line1}</div>
                <div className="big-green">{resourceData.line2}</div>
              </a>
            }
            <div className="resource-option-buttons">
              <img src={infoIcon} alt="Info" onClick={() => props.handlers.infoScreen(resource.id)}></img>
              <img src={shareIcon} alt="Share" onClick={() => props.handlers.shareScreen(resource.id)}></img>
            </div>
          </div>
        )
      })
    }
  } else {
    setTimeout(
      () => {cards = []},
      300
    );
  }
  return (
    <div className="dropdown" id="dropdown-resource" style={{visibility: visible ? "visible" : "hidden"}}>{cards}</div>
  )
}

export default DropdownResource
