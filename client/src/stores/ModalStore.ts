import { create } from "zustand";
import type { ModalType } from "../types/modal";
import type SongDTO from "../types/song";

type ModalStore = {
    audioSong: SongDTO | null;
    setAudioSong: (song: SongDTO) => void;

    audio: boolean;
    upload: boolean;
    playlist: boolean;
    open: (modal: ModalType, cb?: (prev: boolean) => void) => void;
    close: () => void;
    toggle: (modal: ModalType) => void;
};

export const useModalStore = create<ModalStore>((set, get) => ({
    audioSong: null,
    setAudioSong: (song: SongDTO) => set({ audioSong: song }),

    audio: false,
    upload: false,
    playlist: false,
    open: (modal, cb) => {
        const prev = get()[modal];
        if (cb) cb(prev);
        get().close();
        set({ [modal]: true });
    },
    close: () => {
        set({
            audio: false,
            upload: false,
            playlist: false
        })
    },
    toggle: (modal) => {
        const isOpen = get()[modal];
        get().close();
        set({ [modal]: !isOpen });
    },
}));