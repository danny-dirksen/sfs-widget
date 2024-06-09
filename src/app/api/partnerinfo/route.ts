import { getPartner } from '@/utils/sheets'
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  throw new Error("Not Implemented");
}

// // get info about the specific partner indentified in the query string by PIC
// app.get('/api/partnerinfo', (req, res) => {
//   let pic = req.query.p || null;
//   if (pic) {
//     res.json(getPartner(pic));
//   } else {
//     res.json(null);
//   }
// });

// // find the logo for the specific partner indentified in the query string by PIC
// app.get('/api/partnerbranding', (req, res) => {
//   let pic = req.query.p || null;
//   if (pic) {
//     // look to see if the partner has any image branding in our filesystem
//     let found = false; // whether file has been found yet
//     let failedAttempts = 0; // how many fs.access requests failed
//     const imageFormats = [".png", ".jpg", ".jpeg", ".svg", ".gif"]; // list of image extentions to search for
//     imageFormats.forEach(format => {
//       fs.access(path.join(common.root, "public", "partner-branding", pic + format), fs.F_OK, (err) => {
//         if (err) {
//           failedAttempts ++;
//           if (failedAttempts >= imageFormats.length) {
//             res.json(null);
//           }
//           return;
//         }
//         // runs if the file exists and has not been found yet by another of the async requests
//         if (!found) {
//           found = true; // if images hasn't already been found in another format
//           res.sendFile(
//             pic + format,
//             {root: path.join(common.root, "public", "partner-branding")},
//             function(err) {
//               if (err) res.status(err.status).end();
//             }
//           );
//         }
//       });
//     });
//   } else {
//     res.json(null);
//   }
// });