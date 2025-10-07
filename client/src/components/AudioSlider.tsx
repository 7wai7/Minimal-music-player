import { useAudioStore } from "../stores/AudioStore";
import formatDuration from "../utils/formatDuration";
import Slider from "./ui/Slider";

function AudioSlider() {
    const time = useAudioStore(state => state.time);
    const handleTime = useAudioStore(state => state.handleTime);
    const duration = useAudioStore(state => state.duration);

    return (
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
    );
}

export default AudioSlider;