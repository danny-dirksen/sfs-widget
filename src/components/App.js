import React from 'react'
import Header from './Header.js'
import Content from './Content.js'
import Popup from './Popup.js'
import CookieNotice from './CookieNotice.js'
import common from '../common.js'
import sfsLogo from '../resources/ui/sfsLogoWhite.svg'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.mixpanel = props.mixpanel;

    let channel = common.getQueryVariable("c") || "";
    let language = channel ? common.getQueryVariable("l") || "" : "";
    let resource = language ? common.getQueryVariable("r") || "" : "";
    let focused = common.getQueryVariable("f") || "";

    // validate channel name, skip back if invalid
    if (channel && !props.links.channels.some(chan => {
      return (channel.toLowerCase() === chan.name.toLowerCase());
    })) {
      channel = "";
    }

    // validate language name, skip back if invalid
    if (language && !props.links.languages.some(lang => {
      return (language.toLowerCase() === lang.name.toLowerCase());
    })) {
      language = "";
    }

    // validate resource id, skip back if invalid
    if (resource && !props.links.languages.find(lang => {
      return (language.toLowerCase() === lang.name.toLowerCase());
    }).resources.some(rec => {
      return (resource.toLowerCase() === rec.id.toLowerCase());
    })) {
      resource = "";
    }

    let allowCookies = common.getCookie("allowCookies") || null;

    this.state = {
      channel: channel,
      language: language,
      resource: resource,
      focused: focused,
      screen: "",
      pic: props.pic,
      cookie: allowCookies ? common.ensureCookieID() : null,
      allowCookies: allowCookies
    }

    this.handlers = {

      back: () => {
        this.setState({focused: null});
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
        this.setState({focused: null});
        let channelObj = props.links.channels.find(chan => chan.name.toLowerCase() === channel.toLowerCase())
        if (channelObj.languages.length > 1) {
          this.setState({channel: channel})
        } else {
          this.setState({channel: channel, language: channelObj.languages[0].name})
        }
        this.sendAction("selectChannel")
      },

      selectLanguage: language => {
        console.log("Lang selected")
        this.setState({focused: null});
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

      infoScreen: id => {
        this.setState({
          screen: "info",
          focused: id
        });
        this.sendAction("infoScreen");
      },

      shareScreen: id => {
        this.setState({
          screen: "share",
          focused: id
        })
        this.sendAction("shareScreen");
      },

      downloadScreen: resource => {
        this.setState({
          resource: resource,
          screen: "download"
        })
        this.sendAction("downloadScreen")
      },

      exitScreen: () => {
        this.setState({screen: "", focused: ""})
        this.sendAction("exitScreen")
      },

      share: (platform) => {
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
      },

      setCookies: (allowed) => {
        this.setState({
          cookie: allowed ? common.ensureCookieID() : null,
          allowCookies: allowed
        });
        if (allowed) {
          this.mixpanel.opt_in_tracking();
          common.setCookie("allowCookies", true);

        } else {
          this.mixpanel.opt_out_tracking();
          common.clearCookies();
        }
        this.sendAction("setCookiePermission", allowed ? "enabled" : "disabled");
      }

    }
  }

  sendAction(action, data) {
    let d = new Date();
    let sendData = {
      ...data,
      unixTime: d.getTime(),
      pic: this.state.pic,
      channel: this.state.channel,
      language: this.state.language,
      resource: this.state.resource,
      screen: this.state.screen,
      focused: this.state.focused,
      cookieID: common.getCookie("cookieID"),
      action: action
    };
    common.ajax("POST", "/analytics/", sendData);
    this.mixpanel.track(action, sendData);
  }

  componentDidMount() {
    // get cpt info for this partner
    this.sendAction("loadPage");
    fetch("api/partnerinfo" + (this.state.pic ? "?pic=" + this.state.pic : ''))
    .then(r => r.json())
    .then(cpt => {
      this.setState({cpt: cpt});
    });

    // get partner's branding, if they have any.
    fetch("api/partnerbranding" + (this.state.pic ? "?pic=" + this.state.pic : ''))
    .then(r => r.arrayBuffer())
    .then(buffer => { // note this is already an ArrayBuffer
      // there is no buffer.data here
      const blob = new Blob([buffer]);
      const url = URL.createObjectURL(blob);
      this.setState({partnerBranding: url});
    });
  }

  componentDidUpdate() {
    window.history.pushState({}, null, common.queryFromState(this.state) || "/");
  }

  render() {
    let client = {
      channel: this.state.channel,
      language: this.state.language,
      resource: this.state.resource,
      screen: this.state.screen,
      focused: this.state.focused
    };
    return (
      <React.Fragment>
        <Header handleWebsite={this.handlers.website} data={{
          id: "sfs-logo",
          alt: "Songs for Saplings",
          href: "https://songsforsaplings.com/",
          src: sfsLogo,
          corner: 1
        }}/>
        {this.state.cpt && (
          <Header handleWebsite={this.handlers.website} data={{
            id: "partner-branding",
            alt: this.state.cpt.name || this.state.cpt.url,
            href: this.state.cpt.url,
            src: this.state.partnerBranding,
            corner: 1
          }} />
        )}

        <Content links={this.props.links} handlers={this.handlers} client={client} />
        <Popup links={this.props.links} handlers={this.handlers} client={client} />
        <CookieNotice handlers={this.handlers} allowCookies={this.state.allowCookies} />
      </React.Fragment>
    );
  }
}

export default App
