import React from 'react'
import arrow from '../resources/ui/arrow.svg'


function Hint(props) {
  return <div id='hint-container'>{
    props.page === 1 ?
      <>
        <img id='left-side-arrow' className='arrow hint-arrow' src={arrow} alt='->' />
        <span id='hint'> SELECT A SOURCE </span>
        <img className='arrow hint-arrow' src={arrow} alt='->' />
      </>
    : props.page === 2 ?
      <>
        <img id='left-side-arrow' className='arrow hint-arrow' src={arrow} alt='->' />
        <span id='hint'> CHOOSE A LANGUAGE </span>
        <img className='arrow hint-arrow' src={arrow} alt='->' />
      </>
    : <span id='hint'>CHOOSE YOUR MUSIC<br/>AND THAT'S IT!</span>
  }</div>
}

export default Hint
