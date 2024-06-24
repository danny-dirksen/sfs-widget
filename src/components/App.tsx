'use client';

import React, { Suspense, useState } from 'react';
import { BrandingLayer } from './Branding';
import { MainContent } from './MainContent';
import { AnalyticsNotice } from './AnalyticsNotice';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Content, PartnerInfo, Navigation } from '@/utils/models';
import { usePopups } from '@/hooks/usePopups';
import { PopupLayer } from './popups/PopupLayer';


interface AppProps {
  data: {
    content: Content;
    partner: PartnerInfo | null;
  }
};

export const App: React.FC<AppProps> = (props) => {
  const { content, partner } = props.data;
  const analyticsCtx = useAnalytics();
  const { popups, openPopup, closePopup } = usePopups();

  return (
    <div className='h-screen relative bg-sfs-bg text-white'>
      <BrandingLayer data={{ partner }} />
      <MainContent data={{ content, openPopup }}/>
      <PopupLayer data={{
        popups,
        onClose: (name) => closePopup(name)
      }} />
      <AnalyticsNotice data={{ context: analyticsCtx }} />

    </div>
  );
}

// window.history.pushState({}, null, common.queryFromState(this.state) || '/');

// class App extends React.Component {

//   constructor(props) {
//     super(props);

//     let allowCookies = common.getCookie('allowCookies') || null;

//     this.state = {
//       channel: channel,
//       language: language,
//       resource: resource,
//       focused: focused,
//       screen: '',
//       pic: props.pic,
//       cookie: allowCookies ? common.ensureCookieID() : null,
//       allowCookies: allowCookies
//     }

//     this.handlers = {

//       back: () => {
//         this.setState({focused: null});
//         if (this.state.album) {
//           this.setState({album: '', resource: ''})
//         } else if (this.state.language) {
//           let channelObj = props.links.channels.find(chan => chan.name.toLowerCase() === this.state.channel.toLowerCase())
//           if (channelObj.languages.length > 1) {
//             this.setState({language: '', resource: ''})
//           } else {
//             this.setState({language: '', channel: '', resource: ''})
//           }
//         } else if (this.state.channel) {
//           this.setState({channel: '', language: '', resource: ''})
//         }
//         this.sendAction('back')
//       },

//       selectChannel: channel => {
//         this.setState({focused: null});
//         let channelObj = props.links.channels.find(chan => chan.name.toLowerCase() === channel.toLowerCase())
//         if (channelObj.languages.length > 1) {
//           this.setState({channel: channel})
//         } else {
//           this.setState({channel: channel, language: channelObj.languages[0].name})
//         }
//         this.sendAction('selectChannel')
//       },
//       cdOrder: channel => {
//         this.setState({focused: null});
//         this.sendAction('cdOrder');
//       },

//       selectLanguage: language => {
//         this.setState({focused: null});
//         if (this.state.channel) {
//           this.setState({language: language})
//           this.sendAction('selectLanguage')
//         } else {
//           this.handlers.back()
//         }
//       },

//       selectResource: resource => {
//         if (this.state.channel && this.state.language) {
//           this.setState({resource: resource})
//           this.sendAction('selectResource')
//         } else {
//           this.handlers.back()
//         }
//       },

//       infoScreen: id => {
//         this.setState({
//           screen: 'info',
//           focused: id
//         });
//         this.sendAction('infoScreen');
//       },

//       shareScreen: id => {
//         this.setState({
//           screen: 'share',
//           focused: id
//         })
//         this.sendAction('shareScreen');
//       },

//       downloadScreen: resource => {
//         this.setState({
//           resource: resource,
//           screen: 'download',
//           focused: resource
//         })
//         this.sendAction('downloadScreen')
//       },

//       exitScreen: () => {
//         this.setState({screen: '', focused: ''})
//         this.sendAction('exitScreen')
//       },

//       share: (platform) => {
//         this.sendAction('share', {
//           platform: platform
//         })
//       },

//       downloadEmail: (data) => {
//         common.ajax('POST', '/email/download/', {
//           language: this.state.language,
//           resource: this.state.resource,
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email
//         });
//         this.sendAction('download', {
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email
//         });
//       },

//       website: () => {
//         this.sendAction('website')
//       },

//       setCookies: (allowed) => {
//         this.setState({
//           cookie: allowed ? common.ensureCookieID() : null,
//           allowCookies: allowed
//         });
//         if (allowed) {
//           mp.opt_in_tracking();
//           common.setCookie('allowCookies', true);

//         } else {
//           mp.opt_out_tracking();
//           common.clearCookies();
//         }
//         this.sendAction('setCookiePermission', allowed ? 'enabled' : 'disabled');
//       }

//     }
//   }

//   sendAction(action, data) {
//     let d = new Date();
//     let sendData = {
//       ...data,
//       unixTime: d.getTime(),
//       pic: this.state.pic,
//       channel: this.state.channel,
//       language: this.state.language,
//       resource: this.state.resource,
//       screen: this.state.screen,
//       focused: this.state.focused,
//       cookieID: common.getCookie('cookieID'),
//       action: action
//     };
//     common.ajax('POST', '/analytics/', sendData);
//     mp.track(action, sendData);
//   }

//   componentDidMount() {
//     // get cpt info for this partner
//     this.sendAction('loadPage');
//     fetch('api/partnerinfo' + (this.state.pic ? '?p=' + this.state.pic : ''))
//     .then(r => r.json())
//     .then(cpt => {
//       this.setState({cpt: cpt});
//     });

//     // get partner's branding, if they have any.
//     fetch('api/partnerbranding' + (this.state.pic ? '?p=' + this.state.pic : ''))
//     .then(r => r.arrayBuffer())
//     .then(buffer => { // note this is already an ArrayBuffer
//       // there is no buffer.data here
//       const blob = new Blob([buffer]);
//       const url = URL.createObjectURL(blob);
//       this.setState({partnerBranding: url});
//     });
//   }

//   componentDidUpdate() {
//     window.history.pushState({}, null, common.queryFromState(this.state) || '/');
//   }

//   render() {
//     );
//   }
// }

// export App
