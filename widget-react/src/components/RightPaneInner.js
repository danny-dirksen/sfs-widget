import React from 'react'
import DropdownChannel from './DropdownChannel.js'
import DropdownLanguage from './DropdownLanguage.js'
import DropdownResource from './DropdownResource.js'

class RightPaneInner extends React.Component {


  render() {
    let handlers = this.props.handlers
    return (
      <div className="right-pane-inner" style={{transform: "translateX(" + 100 * (1 - this.props.client.page) + "%)"}}>
        <DropdownChannel client={this.props.client} links={this.props.links} selectChannel={handlers.selectChannel} />
        <DropdownLanguage client={this.props.client} links={this.props.links} selectLanguage={handlers.selectLanguage} />
        <DropdownResource client={this.props.client} links={this.props.links} handlers={handlers} />
      </div>
    )
  }
}

export default RightPaneInner
