import React from 'react'
import arrow from '../resources/ui/arrow.svg'

function Back(props) {
  return (
    <div id="back-container" style={{visibility: props.page === 1 ? "hidden" : "visible"}}>
      <div
        className="back"
        onClick={props.handleBack}
        role="button"
        tabIndex="0"
        >
        <div className="arrow-container">
          <img className="arrow" src={arrow} alt="->"/>
        </div>
        <span>BACK</span>
      </div>
    </div>
  )
}

export default Back
