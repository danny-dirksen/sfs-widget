import { NextRequest, NextResponse } from "next/server";
import { DownloadRequestBodySchema } from "@/models/api";
import { logger } from "@/utils/varUtils";
import { sendDownloadLink } from "@/utils/email/sendDownloadLink";
import { getContent } from "@/utils/persistentData/persistentData";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Parse and validate request body
  const body = await req.json();
  const parsed = DownloadRequestBodySchema.safeParse(body);
  if (!parsed.success) {
    logger.error("Invalid download request body: " + parsed.error);
    return new NextResponse("Malformed request.", { status: 400 });
  }
  const { email, firstName, lastName, languageId, resourceId } = parsed.data;

  // Find the url and other info about the download link.
  // First, get all of the content.
  const content = await getContent();
  if (content instanceof Error) {
    return new NextResponse("Failed to get content.", { status: 500 });
  }
  const { resourceTranslations, links } = content;

  // Next, attempt to find the resource translation and the download link.
  const resourceTranslation = resourceTranslations.find(rt => (
    rt.languageId === languageId &&
    rt.resourceId === resourceId
  ));
  if (!resourceTranslation) {
    return new NextResponse("Could not find that resource.", { status: 404 });
  }

  // Extract information for the email.
  const resourceName = `${resourceTranslation.line1 || "Songs for Saplings"} - ${resourceTranslation.line2}`;
  const downloadLink = links.find(
    (l) =>
      l.languageId === languageId &&
      l.resourceId === resourceId &&
      l.channelId === "download",
  );
  if (!downloadLink) {
    return new NextResponse("Could not find that link.", { status: 404 });
  }
  const { url } = downloadLink;

  // Try to send them an email.
  try {
    await sendDownloadLink({ firstName, lastName, downloadUrl: url, email, resourceName });
    return new NextResponse(undefined, { status: 200 });
  } catch (err) {
    logger.error("Error sending mail:", err);
    return new NextResponse("There was an error sending this email.", {
      status: 500,
    });
  }
}
