import React from 'react'
import arrow from '../resources/ui/arrow.svg'

function Back(props) {
  return (
    <div className="back"
         >
      <div onClick={props.handleBack}
           role="button"
           tabIndex="0">
        <img className="arrow" src={arrow} alt="->"/> BACK
      </div>
    </div>
  )
}

export default Back
