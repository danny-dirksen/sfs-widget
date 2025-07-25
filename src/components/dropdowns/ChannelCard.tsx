import { Channel } from "@/models/content";
import { DropdownOption } from "./DropdownOption";
import Image from "next/image";
import { banners } from "./ChannelSelect";

interface ChannelCardProps {
  data: {
    channel: Channel;
    selectChannel: (channelId: string) => void;
  };
}
export function ChannelCard(props: ChannelCardProps) {
  const { channel, selectChannel } = props.data;
  const { channelId, name } = channel;

  const src = banners[channelId];
  const inner = src ? (
    <Image className="h-10 widget:h-6 w-fit" src={src} alt={name} />
  ) : (
    name
  );
  const onClick = () => selectChannel(channelId);

  return (
    <DropdownOption key={channelId} data={{ onClick }}>
      <div className="flex justify-center items-center p-4 widget:p-1">
        {inner}
      </div>
    </DropdownOption>
  );
}
