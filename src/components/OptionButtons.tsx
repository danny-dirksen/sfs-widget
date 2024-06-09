import React from 'react'
import infoIcon from '../resources/ui/info.svg'
import shareIcon from '../resources/ui/share.svg'

function OptionButtons(props) {
  return (
    <div className="resource-option-buttons">
      <button>
        <img src={infoIcon} alt="Info" onClick={() => props.handlers.infoScreen(props.data.id)} />
      </button>
      <button>
        <img src={shareIcon} alt="Share" onClick={() => props.handlers.shareScreen(props.data.id)} />
      </button>
    </div>
  )
}

export default OptionButtons;
