import React from 'react'
import DropdownChannel from './DropdownChannel.js'
import DropdownLanguage from './DropdownLanguage.js'
import DropdownResource from './DropdownResource.js'

class RightPaneInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: true};
  }

  show() {
    this.setState({visible: true});
  }

  render() {
    let {client, links, handlers} = this.props;

    let style = {
      transform: "translateX(" + 33.333 * (1 - this.props.client.page) + "%)"
    };
    return (
      <div className="right-pane-inner" style={style}>
        <DropdownChannel client={client} links={links} handlers={handlers} />
        <DropdownLanguage client={client} links={links} handlers={handlers} />
        <DropdownResource client={client} links={links} handlers={handlers} />
      </div>
    )
  }
}

export default RightPaneInner
