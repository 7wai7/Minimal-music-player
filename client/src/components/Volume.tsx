import { Volume as Volume0, Volume1, Volume2, VolumeOff } from "lucide-react";
import Slider from "./ui/Slider";
import { useAudioStore } from "../stores/AudioStore";

interface Props {
    isVertical?: boolean
}

function Volume({
    isVertical = false
}: Props) {
    const volume = useAudioStore(state => state.volume);
    const handleVolume = useAudioStore(state => state.handleVolume);
    const isMuted = useAudioStore(state => state.isMuted);
    const handleIsMuted = useAudioStore(state => state.handleIsMuted);

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return VolumeOff;
        if (volume > 0.7) return Volume2;
        if (volume > 0.3) return Volume1;
        return Volume0;
    };

    const Icon = getVolumeIcon();

    return (
        <div className="volume-wrapper">
            <button
                onClick={() => handleIsMuted(!isMuted)}
                className="mute-btn icon-wrapper"
            >
                <Icon size={18} color="var(--theme-3-light)" />
            </button>
            <Slider
                className={`volume-slider ${isVertical ? "vertical" : ""}`}
                max={1}
                step={0.01}
                value={volume}
                setValue={handleVolume}
            />
        </div>
    );
}

export default Volume;
