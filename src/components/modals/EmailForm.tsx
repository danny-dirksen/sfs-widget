import { ReactNode, useState } from "react";
import { Input, Button } from "../Styles";
import { ContactInfo } from "@/utils/models";

interface EmailFormProps {
  data: {
    text: {
      init: ReactNode;
      failed: ReactNode;
      sent: ReactNode;
    };
    buttonText: string;
    onSubmit: (contactInfo: ContactInfo) => Promise<'sent' | 'failed'>;
  };
}

export function EmailForm(props: EmailFormProps) {
  const { text, buttonText, onSubmit } = props.data;
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ firstName: '', lastName: '', email: '' });
  const { firstName, lastName, email } = contactInfo;
  const [status, setStatus] = useState<'init' | 'sending' | 'failed' | 'sent'>('init');

  const disableSubmit = firstName.length === 0 || lastName.length === 0 || !validEmail(email) || status === 'sending';


  const handleSubmit = async () => {
    setStatus('sending');
    const result = await onSubmit(contactInfo);
    setStatus(result);
  };

  return status === 'init' || status === 'sending' ? (
    <>
      {text.init}
      <div className='w-full flex flex-row justify-stretch gap-4'>
        <Input
          type='text'
          name='firstName'
          placeholder='First Name'
          value={firstName}
          onChange={(e) => {
            setContactInfo({ ...contactInfo, firstName: e.target.value });
          }} />
        <Input
          type='text'
          name='lastName'
          placeholder='Last Name'
          value={lastName}
          onChange={(e) => {
            setContactInfo({ ...contactInfo, lastName: e.target.value });
          }} />
      </div>
      <Input
        type='email'
        name='email'
        placeholder='Your Email Address'
        value={email}
        onChange={(e) => {
          setContactInfo({ ...contactInfo, email: e.target.value });
        }} />
      <div className='text-center'>
        <Button data={{ type: 'primary' }} onClick={handleSubmit} disabled={disableSubmit}>
          {status === 'sending' ? 'SENDING...' : buttonText}
        </Button>
      </div>
    </>
  ) : (status === 'sent') ? (
    <div className='space-y-4 text-center'>
      {text.sent}
      <Button data={{ type: 'primary' }} onClick={() => setStatus('init')}>SEND ANOTHER</Button>
    </div>
  ) : (status === 'failed') ? (
    <div className='space-y-4 text-center'>
      {text.failed}
      <Button data={{ type: 'primary' }} onClick={() => setStatus('init')}>TRY AGAIN</Button>
    </div>
  ) : null;
}

/** True if email looks valid. */
function validEmail (email: string) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
  return emailRegex.test(email);
}