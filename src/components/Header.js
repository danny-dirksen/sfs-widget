import React from 'react'
import logo from '../resources/ui/sfsLogoWhite.svg'

function Header(props) {
  return (
    <a id="bottom-logo-container" href="https://songsforsaplings.com/" target="_blank" rel="noopener noreferrer" onClick={() => props.handleWebsite()}>
      <img id="bottom-logo" alt="Songs for Saplings" src={logo} />
    </a>
  )
}

export default Header
