import { createContext, useContext, useEffect, useRef, useState } from "react";
import type SongDTO from "../types/song";

type AudioContextType = {
    audio: HTMLAudioElement;
    currentSong: SongDTO | null;
    isPlaying: boolean;
    time: number;
    volume: number;
    isMuted: boolean;
    duration: number;
    handleTime: (value: number) => void;
    handleVolume: (value: number) => void;
    handleIsMuted: (value: boolean) => void;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    togglePlay: () => void;
    playSong: (song: SongDTO) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within AudioProvider");
    return context;
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement>(new Audio());
    const [currentSong, setCurrentSong] = useState<SongDTO | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);

    const handleTime = (value: number) => {
        setTime(value);
        audioRef.current.currentTime = value;
    }

    const handleVolume = (value: number) => {
        setVolume(value);
        audioRef.current.volume = value;
        setIsMuted(value === 0);
        audioRef.current.muted = value === 0;
    }

    const handleIsMuted = (value: boolean) => {
        setIsMuted(value)
        audioRef.current.muted = value;
        setVolume(audioRef.current.volume);
    }

    const togglePlay = () => {
        if (audioRef.current.paused) audioRef.current.play();
        else audioRef.current.pause();
    };

    const playSong = (song: SongDTO) => {
        if (song.id === currentSong?.id) {
            togglePlay();
            return;
        }

        audioRef.current.pause();
        audioRef.current.src = `/api/audio?url=${song.url}`;
        audioRef.current.load();
        audioRef.current.play();

        setCurrentSong(song);
    }

    useEffect(() => {
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const timeupdate = () => setTime(audioRef.current.currentTime);
        const volumechange = () => setVolume(audioRef.current.volume)
        const ended = () => {
            setIsPlaying(!audioRef.current.paused);
        }
        const loadedmetadata = () => {
            setTime(0);
            setDuration(audioRef.current.duration);
        }

        audioRef.current.addEventListener('play', handlePlay);
        audioRef.current.addEventListener('pause', handlePause);
        audioRef.current.addEventListener('timeupdate', timeupdate);
        audioRef.current.addEventListener('volumechange', volumechange);
        audioRef.current.addEventListener('ended', ended);
        audioRef.current.addEventListener('loadedmetadata', loadedmetadata);

        return () => {
            audioRef.current.removeEventListener('play', handlePlay);
            audioRef.current.removeEventListener('pause', handlePause);
            audioRef.current.removeEventListener('ended', ended);
            audioRef.current.removeEventListener('timeupdate', timeupdate);
            audioRef.current.removeEventListener('volumechange', volumechange);
            audioRef.current.removeEventListener('loadedmetadata', loadedmetadata);
        };
    }, []);

    return (
        <AudioContext.Provider value={{
            audio: audioRef.current,
            currentSong,
            isPlaying,
            time,
            volume,
            isMuted,
            duration,
            handleTime,
            handleVolume,
            handleIsMuted,
            setDuration,
            togglePlay,
            playSong
        }}>
            {children}
        </AudioContext.Provider>
    );
};
