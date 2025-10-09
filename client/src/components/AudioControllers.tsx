import { ListMusic, Download } from "lucide-react";
import { useAudioStore } from "../stores/AudioStore";
import downloadFile from "../utils/downloadFile";
import AudioControllersBtns from "./AudioControllersBtns";
import { Link } from "react-router-dom";
import { useModalStore } from "../stores/ModalStore";
import Volume from "./Volume";
import Dropdown from "./Dropdown";

interface Props {
    showAudioModal: () => void
}

function AudioControllers({
    showAudioModal
}: Props) {

    return (
        <div className="audio-controllers">
            <div className="audio-btns">
                <AudioControllersBtns />
                <Volume />
            </div>
            <SongMeta
                showAudioModal={showAudioModal}
            />
            <div className="right-block">
                <PlaylistBtn />
                <DownloadBtn />
            </div>
            <Dropdown
                content={[
                    <Volume isVertical key={1} />,
                    <PlaylistBtn key={2} />,
                    <DownloadBtn key={3} />
                ]}
            />
        </div>
    );
}

function SongMeta({
    showAudioModal
}: {
    showAudioModal: () => void
}) {
    const currentSong = useAudioStore(s => s.currentSong);
    const close = useModalStore(s => s.close);

    return (
        <>
            {currentSong ? (
                <div className="meta">
                    <Link to={`/artist/${currentSong.artist.login}`} className="artist-link" onClick={() => close()}>
                        {currentSong.artist.login}
                    </Link>
                    <span className="dash">-</span>
                    <button
                        onClick={showAudioModal}
                        className="song-title"
                    >
                        {currentSong.title}
                    </button>
                </div>
            ) : (
                <span className="placeholder">No song playing</span>
            )}
        </>
    )
}

function PlaylistBtn() {
    const { toggle } = useModalStore.getState();

    return (
        <button
            onClick={() => toggle("playlist")}
            className="playlist-btn tr-bg icon-wrapper"
        >
            <ListMusic
                size={16}
                color="var(--theme)"
                strokeLinecap="square"
                strokeLinejoin="miter"
            />
        </button>
    )
}

function DownloadBtn() {
    const currentSong = useAudioStore(s => s.currentSong);

    return (
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
    )
}

export default AudioControllers;