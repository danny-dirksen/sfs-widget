import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  throw new Error("Not Implemented");
}

// // for when the user submits a form to recieve a download link
// app.post('/email/download/', (req, res) => {
//   let links = sheetLoader.links;
//   let email = req.body.email;
//   let resourceInfo = links.languages
//     .find(language => language.name === req.body.language).resources
//     .find(resource => resource.id === req.body.resource);
//   let resourceName = (resourceInfo.line1 || "Songs for Saplings") + " - " + (resourceInfo.line2 || "Listen Now");
//   let downloadLink = links.channels
//     .find(channel => channel.name.toLowerCase() === "download").languages
//     .find(language => language.name.toLowerCase() === req.body.language).resources
//     .find(resource => resource.id === req.body.resource).link;
//   try {
//     common.log(`${common.getDate()}, ${email}`, common.root + '/var/mailingList.txt');
//     mailer.download({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: email,
//       resourceName: resourceName,
//       downloadLink: downloadLink
//     })
//     res.status(200).end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).end();
//   }
// })