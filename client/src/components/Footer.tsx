import { Download, ListMusic } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import downloadFile from "../utils/downloadFile";
import AudioControllersBtns from "./AudioControllersBtns";
import AudioSlider from "./AudioSlider";
import Volume from "./Volume";
import { useCallback, useEffect, useRef } from "react";
import { useAudioStore, type AudioStore } from "../stores/AudioStore";
import { useModalStore } from "../stores/ModalStore";

function Footer() {
    const { open, close, toggle, setAudioSong } = useModalStore.getState();
    const footerRef = useRef<HTMLElement | null>(null);
    const metaRef = useRef<HTMLDivElement | null>(null);
    const placeholderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const subscribe = (state: AudioStore) => {
            if (!state.currentSong) {
                footerRef.current?.classList.add("disabled");
                metaRef.current?.classList.add('hidden');
                placeholderRef.current?.classList.remove('hidden');
            }
            else {
                footerRef.current?.classList.remove("disabled");
                metaRef.current?.classList.remove('hidden');
                placeholderRef.current?.classList.add('hidden');
            }
        }

        subscribe(useAudioStore.getState());
        const unsubscribe = useAudioStore.subscribe(subscribe);
        return unsubscribe;
    }, []);

    const showAudioModal = useCallback(() => {
        const currentSong = useAudioStore.getState().currentSong;
        const isOpen = useModalStore.getState().audio;

        if (isOpen) {
            close();

            if (currentSong?.id !== useModalStore.getState().audioSong?.id) {
                setTimeout(() => {
                    if (currentSong) {
                        setAudioSong(currentSong);
                        open("audio");
                    }
                }, 200);
            }
        }
        else {
            if (currentSong) setAudioSong(currentSong);
            open("audio");
        }
    }, []);

    const showPlaylistModal = () => {
        toggle("playlist");
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
        <footer ref={footerRef} onClick={onClick} className="disabled">
            <AudioSlider />
            <div className="audio-controllers">
                <div className="audio-btns">
                    <AudioControllersBtns />
                    <Volume />
                </div>
                <SongMeta
                    showAudioModal={showAudioModal}
                />
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
                            const currentSong = useAudioStore.getState().currentSong;
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

function SongMeta({
    showAudioModal
}: {
    showAudioModal: () => void
}) {
    const currentSong = useAudioStore(s => s.currentSong);

    return (
        <>
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
        </>
    )
}

export default Footer;