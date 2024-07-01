import fs from 'fs';
import path from 'path';

/**
 * To make the email templates more readable, we use MJML to write them. MJML is a markup language that compiles to HTML.
 * It is suggested to use the MJML editor to edit the email templates. Once you have made your changes,
 * Paste minified html into ./email-templates/download.html
 * https://mjml.io/try-it-live/DJd50m0rOt
 */
const downloadTemplate = fs.readFileSync(path.join(process.cwd(), 'email-templates/download.html'), 'utf8');

export interface DownloadEmailData {
  firstName: string,
  lastName: string,
  email: string,
  resourceName: string,
  downloadUrl: string
};

export function generateDownloadEmail(data: DownloadEmailData ) {
  let downloadEmail = downloadTemplate;
  let shareBCC = encodeURIComponent('music-widget@songsforsaplings.com');
  let shareTitle = encodeURIComponent('Some great free music I found');
  let shareBody = encodeURIComponent(`I found this great scripture-based kids' music that our family has really `
    + `been enjoying. You should check it out. It's available for free on a bunch of platforms: https://music.songsforsaplings.com`);
  const fullData = {
    resourceName: data.resourceName,
    firstName: data.firstName,
    websiteLink: 'https://songsforsaplings.com',
    downloadLink: data.downloadUrl,
    unsubscribeLink: 'https://songsforsaplings.us14.list-manage.com/unsubscribe?u=09c372bf98b7d30635bd0cb5c&id=2458faf7dd',
    shareLink: `mailto:?bcc=${shareBCC}&subject=${shareTitle}&body=${shareBody}`,
    resourcesLink: 'https://songsforsaplings.com/resources/free-guitar-chords-lyrics-and-sheet-music/#content',
    logo: 'https://music.songsforsaplings.com/logo%20big.png',
    donateLink: 'https://songsforsaplings.com/donate',
    contactLink: 'https://songsforsaplings.com/contact'
  }
  Object.entries(fullData).forEach(([key, value]) => {
    downloadEmail = downloadEmail.replaceAll(`{{${key}}}`, value);
  });
  return downloadEmail;
}

// This is a test to ensure that all keys are replaced in the email template
const exampleData: DownloadEmailData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  resourceName: 'The Resource',
  downloadUrl: 'https://example.com/download'
};
const exampleEmail = generateDownloadEmail(exampleData);
if (exampleEmail.search(/{{.*}}/) !== -1) {
  throw new Error('Not all keys were replaced in the email template\n\n' + exampleEmail.split('{{')[1].split('}}')[0]);
}