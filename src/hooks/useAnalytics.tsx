"use client";

import { useEffect, useState } from "react";
import { AnalyticsEvent } from "@/models/api";
import type { PropertyDict } from "mixpanel";

/** Generate a random base36 id */
const randomID = () =>
  Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);

type Choice = "none" | "optin" | "optout";

interface TrackingState {
  id: string | null;
  choice: Choice | null;
}

export interface AnalyticsContext {
  trackingChoice: Choice | null;
  setTrackingChoice: (choice: Choice) => void;
  track: (eventName: string, properties: Object) => void;
}

/** This hook provides a reactive wrapper for all the mixpanel operations. */
export function useAnalytics(): AnalyticsContext {
  const [state, _setState] = useState<TrackingState>({
    id: null,
    choice: null,
  });

  // Keep local storage in sync with state.
  function setState(newState: TrackingState) {
    _setState(newState);
    const { id, choice } = newState;
    if (id && choice) {
      localStorage.setItem("sfs_id", id);
      localStorage.setItem("sfs_choice", choice);
    }
  }

  // On mount, load what we can from localStorage.
  useEffect(() => {
    // Load storage, resetting any invalid values.
    const id = localStorage.getItem("sfs_id") || randomID();
    let storedChoice = localStorage.getItem("sfs_choice");
    const choice = (storedChoice === "optin" || storedChoice === "optout")
      ? storedChoice
      : "none";
    setState({ id, choice });
  }, []);

  /**
   * Track a user action unless they opted out.
   * @param eventName same as for mixpanel.track()
   * @param properties same as for mixpanel.track()
   */
  function track(eventName: string, properties: PropertyDict) {
    const { id, choice } = state;
    if (!id || !choice || choice !== "optin") return;
    const event: AnalyticsEvent = { userId: id, eventName, properties };
    fetch("/api/analytics", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  }

  function setTrackingChoice(choice: Choice) {
    setState({ ...state, choice });
    track("setCookiePermission", state);
  }

  return {
    trackingChoice: state.choice,
    setTrackingChoice,
    track,
  };
}
