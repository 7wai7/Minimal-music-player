import { Download, ListMusic, SkipBack, SkipForward } from "lucide-react";
import "../styles/Footer.css"
import PlayPauseBtn from "./PlayPauseBtn";
import Volume from "./Volume";
import Slider from "./Slider";
import { useAudio } from "../contexts/AudioProvider";
import formatDuration from "../utils/formatDuration";
import { Link, useLocation, useNavigate } from "react-router-dom";
import downloadFile from "../utils/downloadFile";

interface Props {
    isOpenAudioModal: boolean;
    isOpenPlaylistModal: boolean;
    closeModal: () => void;
}

function Footer({
    isOpenAudioModal,
    isOpenPlaylistModal,
    closeModal
}: Props) {
    const { isPlaying, togglePlay, time, handleTime, duration, currentSong } = useAudio();
    const navigate = useNavigate();
    const location = useLocation();

    const showAudioModal = () => {
        if (isOpenAudioModal) closeModal();
        else if (currentSong) navigate(`/song/${currentSong.id}`, { state: { previousLocation: location, modalType: "audio", currentSong } })
    }

    const showPlaylistModal = () => {
        if (isOpenPlaylistModal) closeModal();
        else navigate(`/playlist`, { state: { previousLocation: location, modalType: "playlist" } })
    }

    const onClick = (e: React.MouseEvent) => {
        // Якщо клік по посиланню або кнопці — нічого не робимо (дозволяємо нормальну поведінку)
        const anchor = (e.target as HTMLElement).closest('a, button, input');
        if (anchor) return;

        // додатково перевірити dropdown, input тощо:
        if ((e.target as HTMLElement).closest('.dropdown-menu-container')) return;

        showAudioModal();
    }

    return (
        <footer className={!currentSong ? "disabled" : ""} onClick={onClick}>
            <div className="audio-slider-wrapper">
                <span className="time">{formatDuration(time)}</span>
                <Slider
                    className="audio-slider"
                    value={time}
                    setValue={handleTime}
                    max={duration}
                />
                <span className="time">{formatDuration(duration)}</span>
            </div>
            <div className="audio-controllers">
                <div className="audio-btns">
                    <button className="skip-btn icon-wrapper">
                        <SkipBack
                            size={16}
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                        />
                    </button>
                    <PlayPauseBtn
                        isPlaying={isPlaying}
                        onClick={togglePlay}
                    />
                    <button className="skip-btn icon-wrapper">
                        <SkipForward
                            size={16}
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                        />
                    </button>
                    <Volume />
                </div>
                {currentSong ? (
                    <div className="meta">
                        <Link to={`/artist/${currentSong.artist.login}`}>
                            {currentSong.artist.login}
                        </Link>
                        <span>-</span>
                        <button
                            onClick={showAudioModal}
                            className="song-title"
                        >
                            {currentSong.title}
                        </button>
                    </div>
                ) : (
                    <p className="placeholder">No song playing</p>
                )}

                <div className="right-block">
                    <button
                        onClick={showPlaylistModal}
                        className="playlist-btn tr-bg icon-wrapper"
                    >
                        <ListMusic
                            size={16}
                            color="var(--theme)"
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                        />
                    </button>

                    <button
                        onClick={() => {
                            if (currentSong) downloadFile(currentSong.url, currentSong.title);
                        }}
                        className="download-btn tr-bg icon-wrapper"
                    >
                        <Download
                            size={16}
                            color="var(--theme)"
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                        />
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;