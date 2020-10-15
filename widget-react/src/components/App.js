import React from 'react'
import Header from './Header.js'
import Content from './Content.js'
import Popup from './Popup.js'
import common from '../common.js'

class App extends React.Component {

  constructor(props) {
    super(props)
    let channel = common.getQueryVariable("channel") || ""
    let language = channel ? common.getQueryVariable("language") || "" : ""
    let resource = language ? common.getQueryVariable("resource") || "" : ""

    this.state = {
      channel: channel,
      language: language,
      resource: resource,
      screen: "",
      pic: props.pic,
      cookie: common.ensureCookieID()
    }

    this.handlers = {

      back: () => {
        if (this.state.album) {
          this.setState({album: "", resource: ""})
        } else if (this.state.language) {
          let channelObj = props.links.channels.find(chan => chan.name.toLowerCase() === this.state.channel.toLowerCase())
          if (channelObj.languages.length > 1) {
            this.setState({language: "", resource: ""})
          } else {
            this.setState({language: "", channel: "", resource: ""})
          }
        } else if (this.state.channel) {
          this.setState({channel: "", language: "", resource: ""})
        }
        this.sendAction("back")
      },

      selectChannel: channel => {
        let channelObj = props.links.channels.find(chan => chan.name.toLowerCase() === channel.toLowerCase())
        if (channelObj.languages.length > 1) {
          this.setState({channel: channel})
        } else {
          this.setState({channel: channel, language: channelObj.languages[0].name})
        }
        this.sendAction("selectChannel")
      },

      selectLanguage: language => {
        if (this.state.channel) {
          this.setState({language: language})
          this.sendAction("selectLanguage")
        } else {
          this.handlers.back()
        }
      },

      selectResource: resource => {
        if (this.state.channel && this.state.language) {
          this.setState({resource: resource})
          this.sendAction("selectResource")
        } else {
          this.handlers.back()
        }
      },

      infoScreen: resource => {
        this.setState({
          resource: resource,
          screen: "info"
        })
        this.sendAction("infoScreen")
      },

      shareScreen: resource => {
        this.setState({
          resource: resource,
          screen: "share"
        })
        this.sendAction("shareScreen")
      },

      downloadScreen: resource => {
        this.setState({
          resource: resource,
          screen: "download"
        })
        this.sendAction("downloadScreen")
      },

      exitScreen: () => {
        this.setState({screen: ""})
        this.sendAction("exitScreen")
      },

      share: platform => {
        this.sendAction("share", {
          platform: platform
        })
      },

      downloadEmail: (data) => {
        common.ajax("POST", "/email/download/", {
          language: this.state.language,
          resource: this.state.resource,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        })
        this.sendAction("download", {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        })
      },

      website: () => {
        this.sendAction("website")
      }

    }
  }

  sendAction(action, data) {
    let d = new Date();
    common.ajax("POST", "/analytics/", {
      ...data,
      unixTime: d.getTime(),
      pic: this.state.pic,
      channel: this.state.channel,
      language: this.state.language,
      resource: this.state.resource,
      screen: this.state.screen,
      cookieID: common.getCookie("cookieID"),
      action: action,
    })
  }

  componenetDidMount() {
    this.sendAction("loadPage")
  }

  componentDidUpdate() {
    window.history.pushState({}, null, common.queryFromState(this.state) || "/");
  }

  render() {
    let client = {
      channel: this.state.channel,
      language: this.state.language,
      resource: this.state.resource,
      screen: this.state.screen
    }
    return (
      <div>
        <Header handleWebsite={this.handlers.website} />
        <Content links={this.props.links} handlers={this.handlers} client={client} />
        <Popup links={this.props.links} handlers={this.handlers} client={client} />
      </div>
    );
  }
}

export default App
