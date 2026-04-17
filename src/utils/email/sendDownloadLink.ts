import { env } from "../env";
import { convert } from "html-to-text";
import { DownloadEmailData, generateDownloadEmail } from "./generateEmail";
import { logger } from "../logger";

// Initialize Mailgun
import FormData from "form-data";
import Mailgun, { MessagesSendResult } from "mailgun.js";
import { subscribe } from "./subscribe";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({ username: "api", key: env.MAILGUN_KEY });
logger.info("Mailgun initialized");

/**
 * Send download link via mailgun and subscribe them via mailchimp.
 * @param req The request body sent to the API endpoint
 * @returns true if successful
 */
export async function sendDownloadLink(
  emailData: DownloadEmailData,
): Promise<boolean> {
  const emailHTML = generateDownloadEmail(emailData);

  let emailTXT = convert(emailHTML, {
    wordwrap: 130,
  });

  const { msg, err } = await new Promise<{
    msg?: MessagesSendResult;
    err?: any;
  }>((res) => {
    mg.messages
      .create(env.MAILGUN_DOMAIN, {
        from: `"Songs for Saplings Music" <music-widget@songsforsaplings.com>`, // sender address
        to: emailData.email, // list of receivers
        subject: "Your Free Download", // Subject line
        text: emailTXT, // plain text body
        html: emailHTML, // html body
      })
      .then((msg) => res({ msg }))
      .catch((err) => res({ err }));
  });

  if (err || !msg) {
    logger.error(
      `Failed to send email to ${emailData.email} via Mailgun.`
      + ` Error: ${err?.message || err || "Unknown error"}.`
      + ` Data: ${JSON.stringify({
        domain: env.MAILGUN_DOMAIN,
        to: emailData.email,
        subject: "Your Free Download",
      })}`
    );
    return false;
  }
  logger.info(`Sent message to ${emailData.email}: ${msg.details}`);
  const subscribed = await subscribe(
    emailData.email,
    emailData.firstName,
    emailData.lastName,
  );
  if (!subscribed) {
    logger.error(
      `Could not subscribe ${emailData.email} to Mailchimp after sending email.`
    );
  }
  return true;
}

