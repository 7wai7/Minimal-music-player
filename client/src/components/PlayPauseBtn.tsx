import "../styles/PlayPauseBtn.css"
import { Pause, Play } from "lucide-react";

interface Props {
    isPlaying: boolean,
    onClick: () => void
}

function PlayPauseBtn({
    isPlaying,
    onClick
}: Props) {
    return (
        <button onClick={onClick} className={`tr-bg play-pause-btn icon-wrapper ${isPlaying ? "pause" : "play"}`}>
            {
                isPlaying
                    ? <Pause
                        size={16}
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
                    : <Play
                        size={16}
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
            }
        </button>
    );
}

export default PlayPauseBtn;