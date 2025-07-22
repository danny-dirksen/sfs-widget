import arrowWhite from "@/resources/ui/arrowWhite.svg";
import arrowBlack from "@/resources/ui/arrowBlack.svg";
import Image from "next/image";

interface ArrowProps {
  className?: string;
  color?: "black" | "white";
}

export function Arrow(props: ArrowProps) {
  const { className, color } = props;
  const src = color === "black" ? arrowBlack : arrowWhite;
  return (
    <Image
      priority
      className={"h-[1em] w-[1em] " + className}
      src={src}
      alt=""
    />
  );
}
