import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = req.json();
  console.log(process.cwd);
  // exec('your-bash-script.sh', (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error executing script: ${error}`);
  //     return;
  //   }
  //   console.log(`Script output: ${stdout}`);
  //   console.error(`Script errors: ${stderr}`);
  // });
  return new NextResponse('Not implemented. req:\n\n' + JSON.stringify(body), { status: 200 });
}