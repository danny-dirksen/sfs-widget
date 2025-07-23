import { useState } from "react";
import { Popup } from "@/models/models";

export function usePopups() {
  const [popups, setPopups] = useState<Popup<any>[]>([]);

  /** Opens a new popup on the front, replacing any open popups of the same name. */
  function openPopup(newPopup: Popup<any>) {
    const newPopups = popups.filter((p) => p.name !== newPopup.name);
    newPopups.push(newPopup);
    setPopups(newPopups);
  }

  /** Closes a popup of a given name. */
  function closePopup(name: string) {
    setPopups(popups.filter((p) => p.name !== name));
  }

  return { popups, openPopup, closePopup };
}
