import { Download, SkipBack, SkipForward } from "lucide-react";
import "../styles/Footer.css"
import PlayPauseBtn from "./PlayPauseBtn";
import Volume from "./Volume";
import Slider from "./Slider";
import { useAudio } from "../contexts/AudioProvider";
import formatDuration from "../utils/formatDuration";
import downloadFile from "../utils/downloadFile";
import { Link } from "react-router-dom";

function Footer() {
    const { isPlaying, togglePlay, time, handleTime, duration, currentSong } = useAudio();

    return (
        <footer className={!currentSong ? "disabled" : ""}>
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
                        <button className="song-title">{currentSong.title}</button>
                    </div>
                ) : (
                    <p className="placeholder">No song playing</p>
                )}
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
        </footer>
    );
}

export default Footer;