import { useAnalytics } from "@/hooks/useAnalytics";
import { Header, Paragraph } from "../Styles";
import { EmailForm } from "./EmailForm";
import { ContactInfo, PartnerJoinRequestBody } from "@/utils/models";
import { on } from "events";

export function PartnerJoinForm() {
  const { track } = useAnalytics();

  const onSubmit = async (contactInfo: ContactInfo) => {
    const body: PartnerJoinRequestBody = { ...contactInfo };
    track('download', body);
    const resp = await fetch('/api/email/partnerjoin', {
      method: 'post',
      body: JSON.stringify(body)
    });
    return resp.ok ? 'sent' : 'failed';
  };

  return (
    <EmailForm data={{
      text: {
        init: (
          <>
            <Header>Join Our Church Partnership Program</Header>
            <Paragraph>Joining is free and easy. Enter your email address below and we’ll send you instructions.</Paragraph>
          </>
        ),
        failed: (
          <>
            <Header>Oops!</Header>
            <Paragraph>We had trouble sending the instructions. Try again?</Paragraph>
          </>
        ),
        sent: (
          <>
            <Header>Success!</Header>
            <Paragraph>We have sent the instructions.</Paragraph>
          </>
        )
      },
      buttonText: 'SEND ME INSTRUCTIONS',
      onSubmit: onSubmit
    }} />
  );
}
