import { Content, Navigation, Popup } from '@/utils/models';
import { DropdownMenu, DropdownOption } from './Dropdown';
import { PopupInfoLanguage, PopupInfoLanguageProps } from '@/components/popups/PopupInfo';
import { PopupShare } from '../popups/PopupShare';

interface DropdownLanguageProps {
  data: {
    content: Content;
    navigation: Navigation;
    selectLanguage: (languageId: string) => void;
    openPopup: (newPopup: Popup<any>) => void;
    back: () => void;
  }
};

export function DropdownLanguage(props: DropdownLanguageProps) {
  const { content, navigation, selectLanguage, openPopup, back } = props.data;
  const { channel } = navigation;
  // Create cards for languages that correspond to the translations above.
  const languages = content.languages.filter(
    l => content.links.some(link => link.languageId === l.languageId && link.channelId === channel)
  );

  return (
    <DropdownMenu data={{ onScreen: !(!navigation.channel || navigation.language), back }}>
      { languages.map((language) => {
        const { languageId, autonym } = language;
        
        function onClick() {
          selectLanguage(languageId);
        }

        function onClickInfo() {
          const newPopup: Popup<PopupInfoLanguageProps> = {
            name: 'infoLanguage',
            Component: PopupInfoLanguage,
            props: { data: { language } }
          };
          openPopup(newPopup);
        }

        function onClickShare() {
          const newPopup: Popup<null> = {
            name: 'shareLanguage',
            Component: PopupShare,
            props: null
          };
          openPopup(newPopup);
        }

        return (
          <DropdownOption key={languageId} data={{ onClick, onClickInfo, onClickShare }}>
            <div className='h-full flex flex-col justify-center text-center text-xl' style={{
              fontFamily: 'renner-medium,ui-sans-serif,sans-serif'
            }}>
              { autonym }
            </div>
          </DropdownOption>
        )
      }) }
    </DropdownMenu>
  );
}

// import React from 'react';
// import OptionButtons from './OptionButtons.jsx';
// import Back from './BackButton.jsx'

// let cards = []

// function DropdownLanguage(props) {

//   let visible = (props.client.page === 2);

//   if (visible) {
//     cards = [];

//     let channel = props.links.channels.find(channel => {
//       return channel.name.toLowerCase() === props.client.channel.toLowerCase()
//     });
//     if (channel) {
//       channel.languages.forEach((language, index) => {
//         let autonym = props.links.languages.find(lang => lang.name === language.name).autonym
//         cards.push(
//           <div
//             className={`dropdown-option${props.client.focused === language.name ? ' focused' : ''}`}
//             key={index}>
//             <div className='dropdown-text-centerer'
//               role='button'
//               onClick={() => props.handlers.selectLanguage(language.name)}
//               tabIndex='0'>
//               <span className='dropdown-text'>{autonym}</span>
//             </div>
//             <OptionButtons data={{id: language.name}} handlers={props.handlers} />
//           </div>
//         )
//       })
//     }
//   }
//   return (
//     <div className='dropdown' id='dropdown-language' style={{visibility: visible ? 'visible' : 'hidden'}}>
//       <Back handleBack={props.handlers.back} />
//       {cards}
//     </div>
//   )


// }

// export default DropdownLanguage
