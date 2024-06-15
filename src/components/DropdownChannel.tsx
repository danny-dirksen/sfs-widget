import { Content, Navigation } from '@/utils/models';
import { DropdownMenu, DropdownOption } from './Dropdown';

interface DropdownChannelProps {
  data: {
    content: Content;
    navigation: Navigation;
  }
};

export function DropdownChannel(props: DropdownChannelProps) {
  const { content, navigation } = props.data;
  const { channels } = content;

  return (
    <DropdownMenu data={{ onScreen: !navigation.channel }}>
      {channels.map(ch => (
        <DropdownOption key={ch.channelId} data={{
          onClick:  
        }}>Option</DropdownOption>
      ))}
    </DropdownMenu>
  );
}

// import React from 'react'

// let cards = []

// function DropdownChannel(props) {

//   let visible = (props.client.page === 1)

//   if (visible) {
//     cards = [];
//     props.links.channels.forEach((channel, index) => {
//       let nameCaps = channel.name.toUpperCase()
//       cards.push(
//         <button
//           className={`dropdown-option${props.client.focused === channel.name ? ' focused' : ''}`}
//           key={index}
//           onClick={() => props.handlers.selectChannel(channel.name)}
//           tabIndex='0'
//           disabled={props.client.page !== 1 ? true : ''}
//         >
//           <div /> {/* this empty tag causes the language autonym to be centered} */}
//           <p className='dropdown-text'>
//             {channel.image ?
//               <img className='dropdown-logo' src={process.env.PUBLIC_URL + channel.image} alt={nameCaps}></img>
//               : nameCaps
//             }
//           </p>
//           <div /> {/* this empty tag causes the language autonym to be centered} */}
//         </button>
//       )
//     })
//   } else {
//     setTimeout(
//       () => {
//         cards = []
//       },
//       300
//     );
//   }

//   return (
//     <div className='dropdown' id='dropdown-channel' style={{visibility: visible ? 'visible' : 'hidden'}}>
//       {cards}
//       <a  className='dropdown-option'
//           onClick={() => props.handlers.cdOrder()}
//           tabIndex='0'
//           disabled={props.client.page !== 1 ? true : ''}
//           href='https://store.songsforsaplings.com/collections/music'
//           target='_blank'
//           rel='noopener noreferrer' >
          
//         <p className='dropdown-text'>
//           Order CDs
//         </p>
//       </a>
//     </div>
//   )
// }

// export default DropdownChannel
