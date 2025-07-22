import { ReactNode, useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";

interface DropdownMenuProps {
  children: ReactNode[];
  data: {
    onScreen: boolean;
    back?: () => void;
  };
}

export function DropdownMenu(props: DropdownMenuProps) {
  /** When the dropdown is in view, heldProps is just props. When the dropdown comes out of view,
   * heldProps holds the props for a split second so that it keeps its appearance and content as
   * it slides out of view.
   */
  const [heldProps, setHeldProps] = useState<DropdownMenuProps>(props);
  useEffect(() => {
    if (props.data.onScreen) {
      setHeldProps(props);
    } else {
      const timeout = setTimeout(() => {
        setHeldProps(props);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [props, props.data.onScreen]);

  const { children, data } = heldProps;
  const { onScreen, back } = data;

  return (
    <div className="w-1/3 h-full flex flex-col hz:justify-center overflow-hidden">
      {onScreen ? (
        // Scroll box
        <div className="w-full h-fit max-h-full overflow-y-scroll flex flex-col items-center">
          <div className="w-full max-w-md text-black flex flex-col px gap-4 widget:gap-2 p-4">
            {/* Back button holder */}
            {back ? (
              <div className="flex-none flex flex-row justify-start">
                <BackButton data={{ onClick: back }} />
              </div>
            ) : null}
            {children}
          </div>
        </div>
      ) : (
        <>&nbsp;</>
      )}
    </div>
  );
}
