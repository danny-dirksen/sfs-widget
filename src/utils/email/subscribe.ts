import mailchimp from "@mailchimp/mailchimp_marketing";
import { logger } from "../logger";
import { env } from "../env";

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: env.MAILCHIMP_KEY,
  server: env.MAILCHIMP_PREFIX,
});

pingMailchimp().then((response) => {
  if (response instanceof MailchimpError) {
    logger.error(response.message, response.details);
  } else {
    logger.info(`Mailchimp ping successful: ${response.health_status}`);
  }
});

/**
 * Subscribe the user using the mailchimp API
 * @param email
 * @param firstName
 * @param lastName
 * @returns true if successful.
 */
export async function subscribe(
  email: string,
  firstName: string,
  lastName: string
): Promise<boolean> {

  const listId = "2458faf7dd";

  // const emailMd5Hash = createHash("md5").update(email.toLowerCase()).digest("hex");
  const existingMember = await getListMember(listId, email);
  if (existingMember instanceof MailchimpError) {
    logger.error(existingMember.message, existingMember.details);
    return false;
  }
  
  logger.info(`Existing member response: ${existingMember ?? "No existing member found"}`);

  if (existingMember?.status === "subscribed" || existingMember?.status === "unsubscribed") {
    // If the member has already subscribed and/or unsubscribed, we consider this a success and do nothing.
    logger.info(`Email ${email} has already ${existingMember.status} to the list.`);
    return true; // Already subscribed, consider this a success.
  } else {
    // If the member exists but is not subscribed, or if they don't exist at all,
    // we want to subscribe/update them.
    const resp = await addOrUpdateListMember(listId, email, firstName, lastName);
  
    if (resp instanceof MailchimpError) {
      logger.error(resp.message, resp.details);
      return false;
    }
  
    // If we reach this point, the subscription was successful
    logger.info(`Subscribed ${resp.full_name} (${resp.email_address})`);
    return true;
  }
}

/**
 * Custom error class for Mailchimp-related errors, to provide more context in logs.
 */
class MailchimpError extends Error {
  constructor(public message: string, public details: unknown) {
    super(message);
  }
}

async function pingMailchimp(): Promise<mailchimp.ping.APIHealthStatus | MailchimpError> {
  // Fix the incorrectly unwrapped type signature of the ping response by wrapping it in an async function
  const safePing = async () => await mailchimp.ping.get();

  return await safePing()
    .then((res) => {
      return "health_status" in res
        ? res
        : new MailchimpError(`Mailchimp ping returned failed response:`, { response: res });
    })
    .catch((err: unknown) => new MailchimpError(`Mailchimp ping failed:`, {
      err: err instanceof Error ? err.message : String(err),
    }));
}

/**
 * Get a list member from Mailchimp,
 * @returns the member data if successful, or a MailchimpError if there was an error.
 */
function getListMember(listId: string, email: string): Promise<mailchimp.lists.MembersSuccessResponse | undefined | MailchimpError> {
  return mailchimp.lists.getListMember(listId, email)
    .then((response) => {
      return "email_address" in response
        ? response
        : new MailchimpError(`Mailchimp getListMember returned failed response`, {
            listId,
            email,
            response
          });
    })
    .catch((err: unknown) => (
      err instanceof Error && err.message === "Not Found"
        // Member not found is not an error for our purposes, we'll handle it in the calling function.
        ? undefined
        // Wrap errors in a consistent format for easier logging.
        : new MailchimpError(`Mailchimp getListMember failed for ${email}:`, {
            listId,
            email,
            err: err instanceof Error ? err.message : String(err),
          })
    ));
}

/**
 * Add or update a list member in Mailchimp.
 * If the member does not exist, it will be created. If it does exist, it will be updated with the provided info.
 * @returns the member data if successful, or a MailchimpError if there was an error.
 */
function addOrUpdateListMember(listId: string, email: string, firstName: string, lastName: string): Promise<mailchimp.lists.MembersSuccessResponse | MailchimpError> {
  const body: mailchimp.lists.SetListMemberBody = {
    email_address: email,
    status: "subscribed",
    status_if_new: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };
  return mailchimp.lists.setListMember(listId, email, body)
    .then((response) => {
      return "email_address" in response
        ? response
        : new MailchimpError(`Mailchimp setListMember returned failed response for ${email}:`, {
            listId,
            body,
            response
          });
    })
    .catch((err: unknown) => (
      // Wrap errors in a consistent format for easier logging.
      new MailchimpError(`Mailchimp subscription failed for ${email}:`, {
        listId,
        body,
        err: err instanceof Error ? err.message : String(err),
      })
    ));
}