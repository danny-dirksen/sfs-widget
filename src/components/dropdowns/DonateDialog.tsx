import dontateIcon from "@/resources/ui/heart.svg";
import Image from "next/image";

interface DonateDialogProps {
  data: {
    clickLink: (eventType: string, link: string) => void;
  };
}

/** A short blob of text with a yellow racetrack button right below it. */
export function DonateDialog({ data: { clickLink } }: DonateDialogProps) {
  const donateURL = "https://www.songsforsaplings.com/donate/";
  return (
    <>
      {/* <div className='border border-white border-opacity-50 p-4 space-y-4 mx-4'> */}
      <div className="mx-4 widget:mx-0 h-px bg-white bg-opacity-20" />
      <p className="text-white text-center widget:text-sm text-balance">
        We make all of our resources available at no cost to churches, schools
        and families around the world. Would you consider supporting our work?
      </p>
      <center>
        <a
          className="w-fit flex items-center justify-center gap-2 px-4 py-2 shadow-sm rounded-full popout
          bg-yellow-500 hover:bg-[#DA0] transition-colors
          text-white font-bold widget:text-xs uppercase "
          href={donateURL}
          target="_blank"
          onClick={() => clickLink("donate", donateURL)}
        >
          <Image
            src={dontateIcon}
            alt="Donate"
            className="size-5 widget:size-4"
          />
          DONATE
        </a>
      </center>
      <div className="mx-4 h-px bg-white bg-opacity-20" />
      {/* </div> */}
    </>
  );
}
