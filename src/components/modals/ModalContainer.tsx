import x from "@/resources/ui/x.svg";
import Image from "next/image";

interface ModalContainerProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function ModalContainer(props: ModalContainerProps) {
  const { children, onClose } = props;
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center p-2 md:p-8 overflow-hidden">
      <div className="w-full max-w-2xl min-h-30 h-fit max-h-full overflow-y-auto bg-white text-black shadow-lg relative">
        <div className="absolute top-0 right-0">
          <Image
            className="size-8 inline-block p-2 hover:bg-black hover:bg-opacity-10 cursor-pointer"
            alt="X"
            src={x}
            onClick={onClose}
          />
        </div>
        <div className="p-4 md:p-8 space-y-4">{children}</div>
      </div>
    </div>
  );
}
