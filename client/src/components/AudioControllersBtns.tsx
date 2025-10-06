import { SkipBack, SkipForward } from "lucide-react";
import PlayPauseBtn from "./PlayPauseBtn";
import { useAudioStore } from "../stores/AudioStore";

function AudioControllersBtns() {
    const isPlaying = useAudioStore(state => state.isPlaying);
    const togglePlay = useAudioStore(state => state.togglePlay);
    const playPrev = useAudioStore(state => state.playPrev);
    const playNext = useAudioStore(state => state.playNext);
    const canPlayNext = useAudioStore(state => state.canPlayNext);
    const canPlayPrev = useAudioStore(state => state.canPlayPrev);
    
    return (
        <>
            <button
                disabled={!canPlayPrev}
                className="skip-btn icon-wrapper tr-bg"
                onClick={playPrev}
            >
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
            <button
                disabled={!canPlayNext}
                className="skip-btn icon-wrapper tr-bg"
                onClick={playNext}
            >
                <SkipForward
                    size={16}
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                />
            </button>
        </>
    );
}

export default AudioControllersBtns;