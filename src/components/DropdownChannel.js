import React from 'react'

let cards = []

function DropdownChannel(props) {

  let visible = (props.client.page === 1)

  if (visible) {
    cards = []
    props.links.channels.forEach((channel, index) => {
      let nameCaps = channel.name.toUpperCase()
      cards.push(
        <button
          className="dropdown-option"
          key={index}
          onClick={() => props.selectChannel(channel.name)}
          tabIndex="0"
          disabled={props.client.page !== 1 ? true : ""}
        >
          <p className="dropdown-text">
            {channel.image ?
              <img className="dropdown-logo" src={process.env.PUBLIC_URL + channel.image} alt={nameCaps}></img>
              : nameCaps
            }
          </p>
        </button>
      )
    })
  } else {
    setTimeout(
      () => {
        cards = []
      },
      300
    );
  }

  return (
    <div className="dropdown" id="dropdown-channel" style={{visibility: visible ? "visible" : "hidden"}}>{cards}</div>
  )
}

export default DropdownChannel
