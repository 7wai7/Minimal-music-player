import { memo } from "react";
import "../styles/PlayPauseBtn.css"
import { Pause, Play } from "lucide-react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isPlaying: boolean,
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

function PlayPauseBtn({
    isPlaying,
    onClick,
    ...props
}: Props) {
    return (
        <button {...props} onClick={onClick} className={`tr-bg play-pause-btn icon-wrapper ${isPlaying ? "pause" : "play"}`}>
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

export default memo(PlayPauseBtn);