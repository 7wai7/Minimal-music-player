import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type SongDTO from "../types/song";
import usePlaylist from "../hooks/usePlaylist";

type AudioContextType = {
    audio: HTMLAudioElement;
    currentSong: SongDTO | null;
    isPlaying: boolean;
    time: number;
    volume: number;
    isMuted: boolean;
    duration: number;
    playlist: SongDTO[];
    canPlayNext: boolean;
    canPlayPrev: boolean;
    handleTime: (value: number) => void;
    handleVolume: (value: number) => void;
    handleIsMuted: (value: boolean) => void;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    togglePlay: () => void;
    playSong: (song: SongDTO) => void;
    setPlaylist: React.Dispatch<React.SetStateAction<SongDTO[]>>;
    addToPlaylist: (song: SongDTO) => void;
    removeFromPlaylist: (song: SongDTO) => void;
    setAtIndexPlaylist: (from: number, to: number) => void;
    playPrev: () => void;
    playNext: () => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within AudioProvider");
    return context;
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement>(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const {
        currentSong,
        playlist,
        canPlayNext,
        canPlayPrev,
        setCurrentSong,
        setPlaylist,
        add,
        remove,
        setAtIndex,
        playPrev,
        playNext
    } = usePlaylist({ playCb: playSong });

    function playSong(song: SongDTO) {
        if (currentSong && song.id === currentSong.id) {
            togglePlay();
            return;
        }

        audioRef.current.pause();
        audioRef.current.src = `/api/audio?url=${song.url}`;
        audioRef.current.load();
        audioRef.current.oncanplay = () => {
            audioRef.current.play();
        };

        setCurrentSong(song);
    }

    const handleTime = useCallback((value: number) => {
        setTime(value);
        audioRef.current.currentTime = value;
    }, []);

    const handleVolume = useCallback((value: number) => {
        setVolume(value);
        audioRef.current.volume = value;
        setIsMuted(value === 0);
        audioRef.current.muted = value === 0;
    }, []);

    const handleIsMuted = useCallback((value: boolean) => {
        setIsMuted(value)
        audioRef.current.muted = value;
        setVolume(audioRef.current.volume);
    }, []);

    const togglePlay = useCallback(() => {
        if (audioRef.current.paused) audioRef.current.play();
        else audioRef.current.pause();
    }, []);

    useEffect(() => {
        const play = () => setIsPlaying(true);
        const pause = () => setIsPlaying(false);
        const timeupdate = () => setTime(audioRef.current.currentTime);
        const volumechange = () => setVolume(audioRef.current.volume)
        const loadedmetadata = () => {
            setTime(0);
            setDuration(audioRef.current.duration);
        }

        const error = (e: ErrorEvent) => {
            console.log('AUDIO ERROR', e);
        }

        audioRef.current.addEventListener('play', play);
        audioRef.current.addEventListener('pause', pause);
        audioRef.current.addEventListener('timeupdate', timeupdate);
        audioRef.current.addEventListener('volumechange', volumechange);
        audioRef.current.addEventListener('loadedmetadata', loadedmetadata);
        audioRef.current.addEventListener('error', error);

        return () => {
            audioRef.current.removeEventListener('play', play);
            audioRef.current.removeEventListener('pause', pause);
            audioRef.current.removeEventListener('timeupdate', timeupdate);
            audioRef.current.removeEventListener('volumechange', volumechange);
            audioRef.current.removeEventListener('loadedmetadata', loadedmetadata);
            audioRef.current.removeEventListener('error', error);
        };
    }, []);

    useEffect(() => {
        const ended = () => {
            playNext();
        }

        audioRef.current.addEventListener('ended', ended);
        return () => {
            audioRef.current.removeEventListener('ended', ended);
        };
    }, [playNext]);

    return (
        <AudioContext.Provider value={{
            audio: audioRef.current,
            currentSong,
            isPlaying,
            time,
            volume,
            isMuted,
            duration,
            playlist,
            canPlayNext,
            canPlayPrev,
            handleTime,
            handleVolume,
            handleIsMuted,
            setDuration,
            togglePlay,
            playSong,
            setPlaylist,
            addToPlaylist: add,
            removeFromPlaylist: remove,
            setAtIndexPlaylist: setAtIndex,
            playPrev,
            playNext
        }}>
            {children}
        </AudioContext.Provider>
    );
};
