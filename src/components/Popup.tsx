import React from 'react'



function Popup (props) {

  let [client, setClient] = React.useState({...props.client});
  let [lastScreen, setLastScreen] = React.useState(props.client.screen);
  let [emailSent, setEmailSent] = React.useState(false);

  let handleEmailSent = function (data) {
    props.handlers.downloadEmail(data);
    setEmailSent(true);
  }

  React.useEffect(() => {
    if ((props.client.screen) && !(lastScreen)) {
      setClient({...props.client})
    }
    setLastScreen(props.client.screen)
  }, [props.client, lastScreen]);

  let popup = null;
  if (client.focused && client.focused.length > 0) {
    if (client.screen === 'info') {

      if (client.channel) { // if client is on page 2 or later (has already selected channel)

        if (client.language) { // if client is on page 3 (has already selected language)

          let language = props.links.languages.find(lang => lang.name === client.language);
          let resource = language.resources.find(res => res.id === client.focused);
          popup = <PopupInfo client={client} data={{title: resource.line2, body: resource.info}} />;
        } else {
          let language = props.links.languages.find(language => language.name === client.focused);
          popup = <PopupInfo client={client} data={{title: language.autonym, body: language.info}} />;
        }
      }
    } else if (client.screen === 'share') {
      popup = <PopupShare client={client} handlers={props.handlers} />;
    } else if (client.screen === 'download') {
      popup = <PopupDownload client={client} handler={handleEmailSent} sent={emailSent} />;
    }
  }


  let style = {
    visibility: props.client.screen ? 'visible' : 'hidden',
    opacity: props.client.screen ? '1' : '0'
  }

  return (
    <div className='pop-up-screen' style={style}>
      <div className='pop-up-container'>
        <div className='x-container'>
          <img className='x'
               alt='X' src={x}
               onClick={() => {
                 props.handlers.exitScreen();
                 setTimeout(() => setEmailSent(false), 500);
               }} />
        </div>
        {popup}
      </div>
    </div>
  )
}

export default Popup
