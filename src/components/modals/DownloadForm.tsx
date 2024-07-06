import mailIcon from '@/resources/ui/mail.svg';
import { Header, Paragraph } from '@/components/Styles';
import { DownloadRequestBody, ContactInfo } from '@/utils/models';
import Image from 'next/image';
import { useAnalytics } from '@/hooks/useAnalytics';
import { EmailForm } from './EmailForm';

interface DownloadFormProps {
  data: {
    languageId: string;
    resourceId: string;
  };
};

export function DownloadForm(props: DownloadFormProps) {
  const { languageId, resourceId } = props.data;
  const { track } = useAnalytics();

  const onSubmit = async (contactInfo: ContactInfo) => {
    const body: DownloadRequestBody = { ...contactInfo, languageId, resourceId };
    track('download', body);
    const resp = await fetch('/api/email/download', {
      method: 'post',
      body: JSON.stringify(body)
    });
    return resp.ok ? 'sent' : 'failed';
  }

  return (
    <EmailForm data={{
      text: {
        init: (
          <>
            <Header>Download this resource for free!</Header>
            <Paragraph>Enter your email address below to receive a free download link.</Paragraph>
          </>
        ),
        failed: (
          <>
            <Header>Oops!</Header>
            <Image alt='Email Sent' className='w-12 inline mb-4 opacity-30' src={mailIcon} />
            <Paragraph>
              We had trouble sending the link. Try again?
            </Paragraph>
          </>
        ),
        sent: (
          <>
            <Header>Success!</Header>
            <Image alt='Email Sent' className='w-12 inline mb-4' src={mailIcon} />
            <Paragraph>
              We have sent the download link.
            </Paragraph>
          </>
        )
      },
      buttonText: 'SEND DOWNLOAD LINK',
      onSubmit,
    }} />
  );
}