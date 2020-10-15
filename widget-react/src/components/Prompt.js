import React from 'react'

function Prompt(props) {
  switch(props.page) {
    case 1:
      return <div id="prompt">How do you<br/>listen to music?</div>;
    case 2:
      return <div id="prompt">What language<br/>do you speak?</div>;
    default:
      return <div id="prompt">What Volume<br/>would you like?</div>;
  }
}

export default Prompt
