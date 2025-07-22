import { getContent, getPartnerInfo } from "@/utils/sheets";
import { App } from "@/components/App";

interface Props {
  searchParams?: {
    p?: string;
  };
}

const errorScreen = (
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

export default async function Page(props: Props) {
  const pic = props.searchParams?.p || null;
  const content = await getContent(pic);
  const partner = pic ? await getPartnerInfo(pic) : null;
  if (!content) return errorScreen;
  return <App data={{ content, partner }} />;
}
