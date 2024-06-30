import { useState } from 'react';
import mailIcon from '@/resources/ui/mail.svg';
import { Header, Paragraph, Button } from '@/components/Styles';
import { validEmail } from './PopupDownload';
import { DownloadRequestBody, Navigation } from '@/utils/models';
import Image from 'next/image';

interface DownloadFormProps {
  data: {
    languageId: string;
    resourceId: string;
  };
};

export function DownloadForm(props: DownloadFormProps) {
  const { languageId, resourceId } = props.data;

  const [firstName, setFirstName] = useState('Daniel');
  const [lastName, setLastName] = useState('Dirksen');
  const [email, setEmail] = useState('daniel@dirksen.com');
  const [status, setStatus] = useState<'init' | 'sending' | 'failed' | 'sent'>('init');

  if (status === 'sent') {
    return (
      <div className='text-center'>
        <Header>Sent!</Header>
        <Image alt='Email Sent' className='w-12 inline' src={mailIcon} />
        <Paragraph>
          Your download link has been sent to '{email}'. Check your email!
        </Paragraph>
      </div>
    );
  } else if (status === 'failed') {
    return (
      <div className='text-center'>
        <Header>Oops!</Header>
        <Image alt='Email Sent' className='w-12 inline' src={mailIcon} />
        <Paragraph>
          We had trouble sending the link to '{email}'. Try again?
        </Paragraph>
        <Button type='primary' onClick={() => setStatus('init')} >Try Again</Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    const body: DownloadRequestBody = { email, firstName, lastName, languageId, resourceId };
    setStatus('sending');
    const resp = await fetch('/api/email/download', {
      method: 'post',
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      setStatus('failed');
    } else {
      setStatus('sent');
    }
  };

  const enabled = firstName.length > 0 && lastName.length > 0 && validEmail(email);
  const inputClass = 'outline-none border border-black focus:border-sfs-accent px-2 py-1 w-full mb-4';

  return (
    <form>
      <Header>Download this resource for free!</Header>
      <Paragraph>Enter your email address below to receive a free download link.</Paragraph>
      <div className='w-full flex flex-row justify-stretch gap-4'>
        <input
          type='text'
          className={inputClass}
          name='firstName'
          placeholder='First Name'
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }} />
        <input
          type='text'
          className={inputClass}
          name='lastName'
          placeholder='Last Name'
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }} />
      </div>
      <input
        type='email'
        className={inputClass}
        name='email'
        placeholder='Your Email Address'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }} />
      <div className='text-center'>
        <Button type='primary' onClick={handleSubmit} disabled={!enabled || status === 'sending'}>
          { status === 'sending' ? 'SENDING...' : 'SEND DOWNLOAD LINK' }
        </Button>
      </div>
    </form>
  );
}
