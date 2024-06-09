import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  throw new Error("Not Implemented");
}

// // for when the user submits a form to recieve a download link
// app.post('/email/unsubscribe/', (req, res) => {
//   console.dir(req);
//   let email = req.query.email;
//   mailer.unsubscribe(email);
//   res.status(200).end();
// });