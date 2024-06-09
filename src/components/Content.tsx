import React from 'react'
import RightPaneInner from './RightPaneInner.jsx'
import Prompt from './Prompt.jsx'
import Selected from './Selected.jsx'
import Hint from './Hint.jsx'

class Content extends React.Component {
  constructor(props) {
    super(props)
    this.rightPaneRef = React.createRef();
  }

  render() {
    if (this.rightPaneRef.current) {
      this.rightPaneRef.current.scrollTo({top: 0, behavior: "smooth"})
    }
    let page = this.props.client.language ? 3 : (this.props.client.channel ? 2 : 1);
    return (
      <div id="main">
        <div className="pane left-pane">
          <Prompt page={page}/>
          <Selected value={this.props.client.channel} />
          <Selected value={this.props.client.language} />
          <Hint page={page} />
        </div>
        <div className="pane right-pane" ref={this.rightPaneRef}>
          <RightPaneInner
            links={this.props.links}
            client={{
              ...this.props.client,
              page: page,
            }}
            handlers={this.props.handlers}
          />

        </div>
      </div>
    )
  }
}

export default Content
