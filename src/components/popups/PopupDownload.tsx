import { useState } from 'react';
import mailIcon from '../resources/ui/mail.svg';
import { Popup } from '@/components/popups/PopupLayer';

/** True if email looks valid. */
const validEmail = (email: string) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
  return emailRegex.test(email);
}

interface PopupDownloadProps {

};
  
// make sure that the email address at least looks valid. otherwise, hides the download button
export const PopupDownload: Popup = (props: PopupDownloadProps) => {
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ status, setStatus ] = useState<'init' | 'sending' | 'sent'>('init');

  if (status === 'sent') {
    return (
      <div style={{textAlign: 'center'}}>
        <h1 className='pop-up-header'>Sent!</h1>
        <img alt='Email Sent' style={{width: '3rem'}} src={mailIcon}></img>
        <p className='pop-up-text download-instructions'>
          Your download link has been sent to '{email}'. Check your email!
        </p>
      </div>
    )
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    throw new Error("Not implemented.");
  }  

  const enabled = firstName.length > 0 && lastName.length > 0 && validEmail(email);

  return (
    <form id='download-form' onSubmit={handleSubmit}>
      <h1 className='pop-up-header'>Download this resource for free!</h1>
      <p className='pop-up-text download-instructions'>Enter your email address below to receive a free download link.</p>
      <div className='first-last-container'>
        <input
          type='text'
          className='text-input name-input'
          name='firstName'
          placeholder='First Name'
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value)
          }}
        />
        <input
          type='text'
          className='text-input name-input'
          name='lastName'
          placeholder='Last Name'
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
      </div>
      <input
        type='email'
        className='text-input'
        name='email'
        placeholder='Your Email Address'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />
      <input
        type='submit'
        className='form-button'
        disabled={!enabled}
        value='SEND DOWNLOAD LINK'
      />
    </form>
  );
}