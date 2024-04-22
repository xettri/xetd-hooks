"use client";
import { useSyncExternalStore } from "use-sync-external-store/shim";

declare global {
  interface Navigator {
    connection: any;
  }
}

const getSnapshot = (): boolean => {
  return (
    // if no navigator then it might be SSR and consider as online
    typeof navigator === "undefined" ||
    (typeof navigator !== "undefined" && navigator.onLine)
  );
};

// Server snapshot is used when its run in server rendering
// return always true by default if html compiled on server
const getServerSnapshot = (): boolean => {
  return true;
};

const subscribe = (listener: () => void) => {
  if (typeof window !== "undefined") {
    window.addEventListener("online", listener);
    window.addEventListener("offline", listener);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", listener);
      window.removeEventListener("offline", listener);
    }
  };
};

const useNetwork = () => {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return { isOnline, connection: navigator?.connection || {} };
};

export default useNetwork;
