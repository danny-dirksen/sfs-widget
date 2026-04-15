import { App } from "@/components/App";
import { getContent, getPartnerInfo } from "@/utils/persistentData/persistentData";
import { ErrorPage } from "@/components/ErrorPage";
import { connection } from "next/server";
import { NextPage } from "next/types"

interface Props {
  searchParams?: Promise<{
    p?: string;
  }>;
}

const Page: NextPage<Props> = async (props: Props) => {
  await connection(); // Ensure the connection is established before proceeding.
  const pic = (await props.searchParams)?.p || null;
  const content = await getContent(pic);
  const partner = pic ? await getPartnerInfo(pic) : null;

  // Show an error screen if there was a problem.
  if (content instanceof Error || partner instanceof Error) {
    return <ErrorPage data={{ message: `We're having trouble right now.` }} />;
  }

  return <App data={{ content, partner }} />;
}
export default Page;