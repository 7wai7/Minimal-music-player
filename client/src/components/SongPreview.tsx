import type SongDTO from "../types/song";
import type React from "react";
import "../styles/SongPreview.css"
import PlayPauseBtn from "./PlayPauseBtn";
import { Download } from "lucide-react";
import formatDuration from "../utils/formatDuration";
import { useAudio } from "../contexts/AudioProvider";
import downloadFile from "../utils/downloadFile";
import { Link, useLocation } from "react-router-dom";
import { memo } from "react";

interface Props {
    song: SongDTO
}

function SongPreview({
    song
}: Props) {
    const { isPlaying, currentSong, playSong } = useAudio();
    const location = useLocation();
    // const navigate = useNavigate();

    const click = (e: React.MouseEvent) => {
        // Якщо клік по посиланню або кнопці — нічого не робимо (дозволяємо нормальну поведінку)
        const anchor = (e.target as HTMLElement).closest('a, button, input');
        if (anchor) return;

        // додатково перевірити dropdown, input тощо:
        if ((e.target as HTMLElement).closest('.dropdown-menu-container')) return;

        // navigate(`/${song.artist.login}/${song.id}`);
    }

    return (
        <div className="song-preview tr-bg" onClick={click}>
            <PlayPauseBtn
                isPlaying={isPlaying && !!currentSong && currentSong.id === song.id}
                onClick={() => playSong(song)}
            />
            <div className="meta">
                {
                    !location.pathname.startsWith('/artist') &&
                    <>
                        <Link to={`/artist/${song.artist.login}`}>
                            {song.artist.login}
                        </Link>
                        <span>-</span>
                    </>
                }
                <button className="song-title">{song.title}</button>
            </div>
            <span className="duration">{formatDuration(song.duration)}</span>
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
        </div>
    );
}

export default memo(SongPreview)