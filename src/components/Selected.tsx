import React from 'react'


function Selected(props) {
  return (
    <div className="selected" style={{visibility: props.value ? "visible" : "hidden"}}>
      SELECTED: {props.value.toUpperCase()}
    </div>
  )

}

export default Selected
