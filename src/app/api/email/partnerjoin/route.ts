import { NextRequest, NextResponse } from 'next/server';
import { getContent } from '@/utils/sheets';
import { DownloadRequestBody } from '@/utils/models';
import { logger } from '@/utils/varUtils';
import { sendDownloadLink } from '@/utils/email/sendDownloadLink';

export async function POST(req: NextRequest): Promise<NextResponse> {
  return new NextResponse('Not implemented.', { status: 501 });
  // // Parse and validate request body
  // const body = await req.json();
  // const requiredStrings = ['email', 'firstName', 'lastName', 'languageId', 'resourceId'];
  // if (requiredStrings.some(key => !body[key] || typeof body[key] !== 'string')) {
  //   return new NextResponse('Malformed request.', { status: 400 });
  // }
  // const { email, firstName, lastName, languageId, resourceId } = body as DownloadRequestBody;

  // // Find the url and other info about the download link.
  // const content = await getContent();
  // if (!content) return new NextResponse('Failed to get content.', { status: 500 });
  // const { resourceTranslations, links } = content;
  // const resource = resourceTranslations.find(
  //   t => t.languageId === languageId && t.resourceId === resourceId
  // );
  // if (!resource) return new NextResponse('Could not find that resource.', { status: 404 });
  // const resourceName = `${resource.line1 || 'Songs for Saplings'} - ${resource.line2}`;
  // const downloadLink = links.find(
  //   l => l.languageId === languageId && l.resourceId === resourceId && l.channelId === 'download'
  //   );
  // if (!downloadLink) return new NextResponse('Could not find that link.', { status: 404 });
  // const downloadUrl = downloadLink.url;

  // // Try to send them an email.
  // try {
  //   sendDownloadLink({ firstName, lastName, downloadUrl, email, resourceName });
  //   return new NextResponse(undefined, { status: 200 });
  // } catch (err) {
  //   logger.error('Error sending mail: ' + err);
  //   return new NextResponse('There was an error sending this email.', { status: 500 });
  // }
}