import { useState } from "react";

export interface Popup<T> {
  name: string;
  Component: PopupComponent<T>;
  props: T;
}

/**
 * A component type that takes props of type T and returns a JSX element.
 * Used for defining popup components in the usePopups hook.
 */
export type PopupComponent<T> = (props: T) => JSX.Element;


export function usePopups<T>() {
  const [popups, setPopups] = useState<Popup<T>[]>([]);

  /** Opens a new popup on the front, replacing any open popups of the same name. */
  function openPopup(newPopup: Popup<T>) {
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
