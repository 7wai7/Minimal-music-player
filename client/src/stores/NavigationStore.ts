import { create } from "zustand";
import type { Location } from "react-router-dom";

type NavigationStore = {
    previousLocation: Location | null;
    setPreviousLocation: (loc: Location | null) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
    previousLocation: null,
    setPreviousLocation: (loc) => set({ previousLocation: loc }),
}));
