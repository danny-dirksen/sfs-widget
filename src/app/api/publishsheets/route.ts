import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  throw new Error("Not Implemented");
}

// app.get('/api/updatelinks', async (req, res) => {
//   try {
//     await sheetLoader.loadFromSheets();
//     res.sendStatus(200);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send("An error occured while parsing the sheet.")
//   }
// });