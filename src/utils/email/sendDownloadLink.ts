import { env } from "../env";
import { convert } from "html-to-text";
import { DownloadEmailData, generateDownloadEmail } from "./generateEmail";
import { logger } from "../varUtils";
import mailchimp from "@mailchimp/mailchimp_marketing";

// Initialize Mailgun
import FormData from "form-data";
import Mailgun, { MessagesSendResult } from "mailgun.js";
const mailgunCreds = {
  domain: env.MAILGUN_DOMAIN,
};
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
    logger.error("Could not initialize mailchimp: " + response);
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
      .then((msg) => res({ msg })) // logs response data
      .catch((err) => res({ err })); // logs any error
  });
  if (err || !msg) {
    logger.error("Failed to send email: " + err);
    return false;
  }
  logger.info("Sent message: " + msg.details);
  const subscribed = await subscribe(
    emailData.email,
    emailData.firstName,
    emailData.lastName,
  );
  if (!subscribed) {
    logger.error("Could not subscribe ");
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

  const resp = await mailchimp.lists
    .addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    })
    .catch((err) => {
      logger.error("Failed to subscribe: " + err);
    });
  if (!resp || !("full_name" in resp)) {
    return false;
  }
  logger.info(`Subscribed ${resp.full_name} (${resp.email_address})`);
  return true;
}
