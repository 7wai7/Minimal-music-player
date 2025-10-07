import { create } from "zustand";
import type SongDTO from "../types/song";

export type AudioStore = {
    audio: HTMLAudioElement;

    // Плейлист
    playlist: SongDTO[];
    currentSong: SongDTO | null;
    canPlayNext: boolean;
    canPlayPrev: boolean;
    lastPlaylistKey: string | null;

    // Стани аудіо
    isPlaying: boolean;
    time: number;
    duration: number;
    volume: number;
    isMuted: boolean;

    // --- Дії ---
    setCurrentSong: (song: SongDTO) => void;
    setPlaylist: (songs: SongDTO[]) => void;
    setPlaylistByKey: (key: string, songs: SongDTO[]) => void;
    addToPlaylist: (song: SongDTO) => void;
    removeFromPlaylist: (song: SongDTO) => void;
    setAtIndexPlaylist: (from: number, to: number) => void;

    playSong: (song: SongDTO) => void;
    playNext: () => void;
    playPrev: () => void;
    togglePlay: () => void;
    handleTime: (value: number) => void;
    handleVolume: (value: number) => void;
    handleIsMuted: (value: boolean) => void;
    setDuration: (value: number) => void;
};

export const useAudioStore = create<AudioStore>((set, get) => {
    const audio = new Audio();

    // --- Функції для плейлисту ---
    const clampIndex = (index: number) => {
        const length = get().playlist.length;
        return (index + length) % length;
    };

    const playNextOrPrev = (direction: 1 | -1) => {
        const { currentSong, playlist, playSong } = get();
        if (!currentSong || playlist.length <= 1) return;
        const index = playlist.findIndex((s) => s.id === currentSong.id);
        if (index !== -1) {
            const nextSong = playlist[clampIndex(index + direction)];
            playSong(nextSong);
        }
    };

    const updateCanPlay = () => {
        const playlist = get().playlist;
        set({
            canPlayNext: playlist.length > 1,
            canPlayPrev: playlist.length > 1,
        });
    };

    // --- Події аудіо ---
    audio.addEventListener("play", () => set({ isPlaying: true }));
    audio.addEventListener("pause", () => set({ isPlaying: false }));
    audio.addEventListener("timeupdate", () => set({ time: audio.currentTime }));
    audio.addEventListener("volumechange", () => set({ volume: audio.volume }));
    audio.addEventListener("loadedmetadata", () =>
        set({ duration: audio.duration, time: 0 })
    );
    audio.addEventListener("ended", () => playNextOrPrev(1));

    return {
        audio,
        playlist: [],
        currentSong: null,
        canPlayNext: false,
        canPlayPrev: false,
        lastPlaylistKey: null,
        isPlaying: false,
        time: 0,
        duration: 0,
        volume: 0.5,
        isMuted: false,

        setCurrentSong: (song) => set({ currentSong: song }),
        setPlaylist: (songs) => {
            set({ playlist: songs })
            updateCanPlay();
        },
        addToPlaylist: (song) => {
            const { playlist } = get();
            const filtered = playlist.filter((s) => s.id !== song.id);
            set({ playlist: [...filtered, song] });
            updateCanPlay();
        },
        removeFromPlaylist: (song) => {
            const { playlist } = get();
            set({ playlist: playlist.filter((s) => s.id !== song.id) });
            updateCanPlay();
        },
        setAtIndexPlaylist: (from, to) => {
            const { playlist } = get();
            if (from === to) return;
            const updated = [...playlist];
            const [moved] = updated.splice(from, 1);
            updated.splice(to, 0, moved);
            set({ playlist: updated });
            updateCanPlay();
        },
        setPlaylistByKey(key, songs) {
            const lastKey = get().lastPlaylistKey;

            if(key === lastKey) return;
            get().setPlaylist(songs);
        },

        playSong: (song) => {
            const { currentSong } = get();
            if (currentSong && currentSong.id === song.id) {
                get().togglePlay();
                return;
            }

            audio.pause();
            audio.src = `/api/audio?url=${song.url}`;
            audio.load();
            audio.oncanplay = () => audio.play();
            set({ currentSong: song });
        },
        playNext: () => playNextOrPrev(1),
        playPrev: () => playNextOrPrev(-1),
        togglePlay: () => {
            if (audio.paused) audio.play();
            else audio.pause();
        },
        handleTime: (value) => {
            audio.currentTime = value;
            set({ time: value });
        },
        handleVolume: (value) => {
            audio.volume = value;
            audio.muted = value === 0;
            set({ volume: value, isMuted: value === 0 });
        },
        handleIsMuted: (value) => {
            audio.muted = value;
            set({ isMuted: value });
        },
        setDuration: (value) => set({ duration: value }),
    };
});
