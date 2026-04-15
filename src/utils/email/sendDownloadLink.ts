import { env } from "../env";
import { convert } from "html-to-text";
import { DownloadEmailData, generateDownloadEmail } from "./generateEmail";
import { logger } from "../varUtils";
import mailchimp from "@mailchimp/mailchimp_marketing";

// Initialize Mailgun
import FormData from "form-data";
import Mailgun, { MessagesSendResult } from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({ username: "api", key: env.MAILGUN_KEY });
logger.info("Mailgun initialized");

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: env.MAILCHIMP_KEY,
  server: env.MAILCHIMP_PREFIX,
});
(async () => {
  const response = await mailchimp.ping.get();
  if ("health_status" in response) {
    logger.info(response.health_status); // Everything's chimpy!
  } else {
    logger.error("Mailchimp initialization failed: Unexpected response format: " + JSON.stringify(response));
  }
})();

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

/**
 * Subscribe the user using the mailchimp API
 * @param email
 * @param firstName
 * @param lastName
 * @returns true if successful.
 */
async function subscribe(
  email: string,
  firstName: string,
  lastName: string,
): Promise<boolean> {
  const listId = "2458faf7dd";

  const resp = await mailchimp.lists.addListMember(listId, {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  }).catch((err) => (
    // Wrap errors in a consistent format for easier logging.
    new Error(`Mailchimp subscription failed for ${email}: ${err?.message || err || "Unknown error"}`)
  ));

  if (resp instanceof Error) {
    logger.error(resp.message);
    return false;
  }

  // Check if response is a falure response (e.g. if the full_name field is missing,
  // it's likely the subscription failed but Mailchimp returned a 200 status code with an error message
  // in the body instead of throwing an error)
  if (!("full_name" in resp)) {
    logger.error(
      `Mailchimp subscription for ${email} seems to have failed.`
      + ` Response: ${JSON.stringify(resp)}`
    );
    return false;
  }

  // If we reach this point, the subscription was successful
  logger.info(`Subscribed ${resp.full_name} (${resp.email_address})`);
  return true;
}
