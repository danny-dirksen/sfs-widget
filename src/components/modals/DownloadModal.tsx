import { useEffect, useState } from 'react';
import { Navigation } from '@/utils/models';
import { Paragraph, Button, Header } from '@/components/Styles';
import { DownloadForm } from './DownloadForm';
import { ChurchSelect } from './ChurchSelect';
import { PartnerJoinForm } from './PartnerJoinForm';
import { BackButton } from '../BackButton';

export interface ModalDownloadProps {
  data: {
    navigation: Navigation;
    selectPartner: (pic: string | null) => void;
  }
};

type Member = 'init' | 'yes' | 'no' | 'dontKnow' | 'justDownload';

interface ModalDownloadState {
  member: Member;
}

// make sure that the email address at least looks valid. otherwise, hides the download button
export function DownloadModal (props: ModalDownloadProps) {
  const { navigation, selectPartner } = props.data;
  const { pic, language, resource } = navigation;

  // At this point, there should always be a language.
  if (!language || !resource) return <Paragraph>A problem occured. Please close and try again.</Paragraph>;

  // Track whether or not they have answered.
  const [ state, setState ] = useState<ModalDownloadState>({
    member: pic ? 'yes' : 'init'
  });
  useEffect(() => {
    if (pic) {
      setState({ member: 'yes' });
    }
  }, [pic]);

  // Tracks which church they are from.
  const { member } = state;
  function setMember(member: Member) {
    setState({ ...state, member })
  }

  function onSelectPartner(pic: string) {
    if (pic === 'other') {
      setMember('no');
      selectPartner(null);
    } else {
      selectPartner(pic);
    }
  }

  const back = <BackButton data={{onClick: () => setMember('init'), color: 'black'}} />;

  return member === 'init' ? (
    <>
      <Header>Download This Resource</Header>
      <Paragraph>Is your church a member of our church partnership program?</Paragraph>
      {/* Options are YES/NO/I DON’T KNOW */}
      <div className='flex flex-row justify-center gap-2 flex-wrap mb-4'>
        <Button onClick={() => setMember('yes')}>YES</Button>
        <Button onClick={() => setMember('no')}>NO</Button>
        <Button onClick={() => setMember('dontKnow')}>I DON'T KNOW</Button>
        <Button onClick={() => setMember('justDownload')}>JUST DOWNLOAD</Button>
      </div>
    </>
  ) : member === 'yes' ? (
    // YES -> They type in the name of their church. We will match with “Name of Church, and City/State” and they pick one. Continue them on, give them free downloads (w/email address input)
    pic ? (
      <DownloadForm data={{ languageId: language, resourceId: resource }} />
    ) : (
      <>
        {back}
        <Header>Please select your church</Header>
        <ChurchSelect value={pic} onChange={pic => onSelectPartner(pic)}></ChurchSelect>
      </>
    )
  ) : member === 'no' ? (
    // NO -> Form “Joining is free and easy. Put your email address here and we’ll send you instructions.” Forms: first, last, email, and “Skip and continue to download.
    <>
      {back}
      <PartnerJoinForm />
      <center>
        <Button onClick={() => setMember('justDownload')}>SKIP TO DOWNLOAD</Button>
      </center>
    </>
  ) : member === 'dontKnow' ? (
    // I DON’T KNOW -> Short description of church partnership program. Lookup church again. “Don’t see your church?” brings them to the identical “Joining is free…” form.
    <>
      {back}
      <Header>Church Partnership Program</Header>
      <Paragraph>
        Our church partnership program offers free resources to churches around the world. If you are unsure if your church is a member, you can look up your church or join the program.
      </Paragraph>
      <ChurchSelect value={pic} onChange={pic => onSelectPartner(pic)}></ChurchSelect>
      <center>
        <Button onClick={() => setMember('no')}>I DON'T SEE MY CHURCH</Button>
      </center>
    </>
  ) : member === 'justDownload' ? (
    <>
      {back}
      <DownloadForm data={{ languageId: language, resourceId: resource }} />
    </>
  ) : null;
}