import { useEffect, useState } from "react";
import type SongDTO from "../types/song";

interface Props {
    playCb: (song: SongDTO) => void;
}

export default function usePlaylist({
    playCb
}: Props) {
    const [currentSong, setCurrentSong] = useState<SongDTO | null>(null);
    const [playlist, setPlaylist] = useState<SongDTO[]>([]);
    const [canPlayNext, setCanPlayNext] = useState(false);
    const [canPlayPrev, setCanPlayPrev] = useState(false);

    const add = (song: SongDTO) => {
        const songs = playlist.filter(s => s.id !== song.id);
        setPlaylist([...songs, song]);
    }

    const remove = (song: SongDTO) => {
        setPlaylist(playlist.filter(s => s.id !== song.id));
    }

    const setAtIndex = (from: number, to: number) => {
        if (from === to) return;

        const updated = [...playlist];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setPlaylist(updated);
    }

    const playNext = () => {
        playNextOrPrev(1);
    }

    const playPrev = () => {
        playNextOrPrev(-1);
    }

    const playNextOrPrev = (direction: 1 | -1) => {
        if (!currentSong || playlist.length <= 1) return;

        const index = playlist.findIndex((s) => s.id === currentSong.id);
        if (index !== -1) {
            const newSong = playlist[clampIndex(index + direction)];
            playCb(newSong);
        }
    }

    const clampIndex = (index: number)=> {
        return (index + playlist.length) % playlist.length;
    }

    useEffect(() => {
        if (currentSong) {
            const index = playlist.findIndex((s) => s.id === currentSong.id);
            if(index !== -1) {
                setCanPlayNext(!!playlist[clampIndex(index + 1)] && playlist.length > 1)
                setCanPlayPrev(!!playlist[clampIndex(index - 1)] && playlist.length > 1)
            }
        }
    }, [currentSong, playlist]);

    return {
        currentSong,
        playlist,
        canPlayNext,
        canPlayPrev,
        setCurrentSong,
        setPlaylist,
        add,
        remove,
        setAtIndex,
        playNext,
        playPrev
    }
}