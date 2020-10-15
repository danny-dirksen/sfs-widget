import React from 'react'
import x from '../resources/ui/x.svg'
import PopupInfo from './PopupInfo.js'
import PopupShare from './PopupShare.js'
import PopupDownload from './PopupDownload.js'



function Popup (props) {

  let [client, setClient] = React.useState({...props.client})
  let [lastScreen, setLastScreen] = React.useState(props.client.screen)

  React.useEffect(() => {
    if ((props.client.screen) && !(lastScreen)) {
      setClient({...props.client})
    }
    setLastScreen(props.client.screen)
  }, [props.client, lastScreen])

  let resourceInfo
  if (client.screen) {
    resourceInfo = props.links.languages.find(language => language.name === client.language).resources
  }


  let style = {
    visibility: props.client.screen ? "visible" : "hidden",
    opacity: props.client.screen ? "1" : "0"
  }
  return (
    <div className="pop-up-screen" style={style}>
      <div className="pop-up-container">
        <div className="x-container">
          <img className="x" alt="X" src={x} onClick={() => props.handlers.exitScreen()} />
        </div>
        {
          client.screen === "info" ? <PopupInfo client={client} resourceInfo={resourceInfo} />
          : client.screen === "share" ? <PopupShare client={client} handlers={props.handlers} />
          : client.screen === "download" ? <PopupDownload client={client} handlers={props.handlers} /> : null
        }
      </div>
    </div>
  )
}

export default Popup
