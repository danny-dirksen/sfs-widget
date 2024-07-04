import { useEffect, useState } from 'react';
import { Navigation, PartnerInfo, PopupComponent } from '@/utils/models';
import { Paragraph, Button, Header } from '@/components/Styles';
import { DownloadForm } from './DownloadForm';
import { Church, ChurchSelect } from './ChurchSelect';

/** True if email looks valid. */
export const validEmail = (email: string) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
  return emailRegex.test(email);
}

export interface PopupDownloadProps {
  data: {
    navigation: Navigation;
  }
};

type Member = 'init' | 'yes' | 'no' | 'dontKnow' | 'justDownload';

interface PopupDownloadState {
  member: Member;
  church: Church | null;
}

// make sure that the email address at least looks valid. otherwise, hides the download button
export const PopupDownload: PopupComponent<PopupDownloadProps> = (props) => {
  const { navigation } = props.data;
  const { pic, language, resource } = navigation;

  // At this point, there should always be a language.
  if (!language) return <Paragraph>A problem occured please close and try again.</Paragraph>;

  // Track whether or not they have answered.
  const [ state, setState ] = useState<PopupDownloadState>({
    member: pic ? 'yes' : 'init',
    church: null
  });
  // Tracks which church they are from.
  const { member, church } = state;
  function setMember(member: Member) {
    setState({ ...state, member })
  }
  function setChurch(church: Church) {
    setState({ ...state, church })
  }
  

  const downloadForm = ((member === 'yes' && pic) || member === 'justDownload') ? (
    <DownloadForm data={{ languageId: language, resourceId: resource!}} />
  ) : null;

  return (
    <>
      <Header>Download This Resource</Header>
      <Paragraph>Is your church a member of our church partnership program?</Paragraph>
      <div className='flex flex-row gap-2 flex-wrap'>
        <Button type={member === 'yes' ? 'primary' : 'secondary'} onClick={() => setMember('yes')}>YES</Button>
        <Button type={member === 'no' ? 'primary' : 'secondary'} onClick={() => setMember('no')}>NO</Button>
        <Button type={member === 'dontKnow' ? 'primary' : 'secondary'} onClick={() => setMember('dontKnow')}>I DON'T KNOW</Button>
        <Button type={member === 'justDownload' ? 'primary' : 'secondary'} onClick={() => setMember('justDownload')}>JUST DOWNLOAD</Button>
      </div>
      { member === 'yes' ? (
        <ChurchSelect value={church} onChange={(church) => setChurch(church)}></ChurchSelect>
      ) : null }
    </>
  );

  function selectChurch(pic: string) {
    
  }

  // return <DownloadForm data={{ languageId: language, resourceId: resource!}} />


  // if (member === 'yes' || member === 'justDownload') {
  // }

  // return (
  //   <>
  //     {/* <Header>Download this resource</Header> */}
  //     <Paragraph>Is your church a member of our church partnership program?</Paragraph>
  //     <div className='flex flex-row justify-center gap-2 flex-wrap'>
  //       <Button type='secondary' onClick={() => setState({...state, member: 'yes'})}>YES</Button>
  //       <Button type='secondary' onClick={() => setState({...state, member: 'no'})}>NO</Button>
  //       <Button type='secondary' onClick={() => setState({...state, member: 'dontKnow'})}>I DON'T KNOW</Button>
  //     </div>
  //   </>
  // )
//   On clicking a download button, a menu shows up saying “Is your church a member of our church partnership program?” YES/NO/I DON’T KNOW
// YES -> They type in the name of their church. We will match with “Name of Church, and City/State” and they pick one. Continue them on, give them free downloads (w/email address input)
// NO -> Form “Joining is free and easy. Put your email address here and we’ll send you instructions.” Forms: first, last, email, and “Skip and continue to download.
// I DON’T KNOW -> Short description of church partnership program. Lookup church again. “Don’t see your church?” brings them to the identical “Joining is free…” form.
  
  // 
  // if (state === State.member || state === State.justDownload) {
  //   return <DownloadForm />
  // }
  // if (state === State.init) {
  //   return <SelectChurch />
  // }
  // if (state === State.dontKnow) {
  //   // 
  // }
  // return (state === State.member || state === State.justDownload) ? 
}

function SelectChurch() {

}