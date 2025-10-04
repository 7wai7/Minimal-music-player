import { useSyncExternalStore } from "react";

export function useSyncListener(subscribe: any, event: string, getSnapshot: () => any) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const listener = () => onStoreChange();
      subscribe.addEventListener(event, listener);
      return () => subscribe.removeEventListener(event, listener);
    },
    getSnapshot
  );
}
