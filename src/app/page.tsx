import { App } from "@/components/App";
import { getContent, getPartnerInfo } from "@/utils/persistentData/persistentData";

interface Props {
  searchParams?: {
    p?: string;
  };
}

export default async function Page(props: Props) {
  const pic = props.searchParams?.p || null;
  const content = await getContent(pic);
  const partner = pic ? await getPartnerInfo(pic) : null;

  // Show an error screen if there was a problem.
  if (content instanceof Error || partner instanceof Error) {
    return <ErrorScreen />;
  }

  return <App data={{ content, partner }} />;
}


function ErrorScreen() {
  return (
    <div className="h-full text-center flex flex-col justify-center">
      <div>
        {`We're having trouble right now. Please try again later.`}
        <br />
        For now, you can check out{" "}
        <a className="underline" href="https://songsforsaplings.com">
          our website
        </a>{" "}
        to find resources.
      </div>
    </div>
  );
}