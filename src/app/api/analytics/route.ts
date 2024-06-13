import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  throw new Error('Not Implemented');
}

// app.post('/analytics/', (req, res) => {
//   let data = JSON.stringify(req.body);
//   fs.appendFile(common.root + '/var/usageData.json', data + '\n' , function (err) {
//      if (err) throw err;
//   });
//   res.status(200).end();
// });