import type SongDTO from "../types/song";
import type React from "react";
import "../styles/SongPreview.css"
import PlayPauseBtn from "./PlayPauseBtn";
import { Download, ListEnd, ListX } from "lucide-react";
import formatDuration from "../utils/formatDuration";
import downloadFile from "../utils/downloadFile";
import { Link, useLocation } from "react-router-dom";
import { memo, useEffect, useRef, useState } from "react";
import formatBytes from "../utils/formatBytes";
import { useAudioStore } from "../stores/AudioStore";
import { useModalStore } from "../stores/ModalStore";

function PlayPauseBtnPreview({
    song,
    onClick
}: {
    song: SongDTO,
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const playSong = useAudioStore(state => state.playSong);

    useEffect(() => {
        const unsubscribe = useAudioStore.subscribe((state) => {
            setIsPlaying(state.isPlaying && !!state.currentSong && state.currentSong.id === song.id);
        });
        return unsubscribe;
    }, []);

    return (
        <PlayPauseBtn
            isPlaying={isPlaying}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                playSong(song);
                onClick?.(e);
            }}
        />
    )
}

interface Props {
    song: SongDTO,
    isPlaylistModal?: boolean,
    listKey?: string | null,
    list?: SongDTO[]
}

function SongPreview({
    song,
    isPlaylistModal = false,
    listKey,
    list
}: Props) {
    const addToPlaylist = useAudioStore(state => state.addToPlaylist);
    const removeFromPlaylist = useAudioStore(state => state.removeFromPlaylist);
    const setPlaylistByKey = useAudioStore(state => state.setPlaylistByKey);
    const { open, setAudioSong } = useModalStore.getState();
    const ref = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = useAudioStore.subscribe((state) => {
            if (!ref.current) return;

            if (!!state.currentSong && state.currentSong.id === song.id) {
                ref.current.classList.add("active");
            }
            else ref.current.classList.remove("active");
        });
        return unsubscribe;
    }, []);

    const onClick = (e: React.MouseEvent) => {
        // Якщо клік по посиланню або кнопці — нічого не робимо (дозволяємо нормальну поведінку)
        const anchor = (e.target as HTMLElement).closest('a, button, input');
        if (anchor) return;

        // додатково перевірити dropdown, input тощо:
        if ((e.target as HTMLElement).closest('.dropdown-menu-container')) return;

        setAudioSong(song);
        open('audio');
    }

    return (
        <div ref={ref} className={`song-preview tr-bg`} onClick={onClick}>
            <div className="block-l">
                {/* {
                    isPlaylistModal && (
                        <div
                            className="drag-btn icon-wrapper"
                        >
                            <Equal
                                size={16}
                                color="var(--theme-3-light)"
                            />
                        </div>
                    )
                } */}
                <PlayPauseBtnPreview
                    song={song}
                    onClick={() => {
                        if(listKey && list && list.length > 0) {
                            setPlaylistByKey(listKey, list);
                        }
                    }}
                />
                <div className="meta">
                    {
                        (
                            !location.pathname.startsWith('/artist') ||
                            isPlaylistModal
                        ) &&
                        <>
                            <Link to={`/artist/${song.artist.login}`}>
                                {song.artist.login}
                            </Link>
                            <span>-</span>
                        </>
                    }
                    <span className="song-title">{song.title}</span>
                </div>
            </div>
            <div className="block-r">
                <span>{new Date(song.release_date).toLocaleDateString()}</span>
                <span>{formatBytes(song.size)}</span>
                <span className="duration">{formatDuration(song.duration)}</span>
                {
                    !isPlaylistModal && (
                        <button
                            onClick={() => addToPlaylist(song)}
                            className="add-to-playlist-btn icon-wrapper tr-bg"
                        >
                            <ListEnd
                                size={16}
                                color="var(--theme)"
                            />
                        </button>
                    )
                }
                <button
                    onClick={() => downloadFile(song.url, song.title)}
                    className="download-btn icon-wrapper tr-bg"
                >
                    <Download
                        size={16}
                        color="var(--theme)"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
                </button>
                {
                    isPlaylistModal && (
                        <button className="remove-from-playlist-btn icon-wrapper tr-bg" onClick={() => removeFromPlaylist(song)}>
                            <ListX
                                size={16}
                                color="var(--theme)"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                            />
                        </button>
                    )
                }
            </div>
        </div>
    );
}

export default memo(SongPreview)