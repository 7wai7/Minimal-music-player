import { useCallback, useEffect, useRef } from "react";
import { useAudioStore, type AudioStore } from "../stores/AudioStore";
import { useModalStore } from "../stores/ModalStore";
import "../styles/Footer.css";
import AudioSlider from "./AudioSlider";
import AudioControllers from "./AudioControllers";

function Footer() {
    const { open, close, setAudioSong } = useModalStore.getState();
    const footerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const subscribe = (state: AudioStore) => {
            if (!state.currentSong) {
                footerRef.current?.classList.add("disabled");
            }
            else {
                footerRef.current?.classList.remove("disabled");
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

    const onClick = (e: React.MouseEvent) => {
        // Якщо клік по посиланню або кнопці — нічого не робимо (дозволяємо нормальну поведінку)
        const anchor = (e.target as HTMLElement).closest('a, button, input, .dropdown');
        if (anchor) return;

        showAudioModal();
    }

    return (
        <footer ref={footerRef} onClick={onClick} className="disabled">
            <AudioSlider />
            <AudioControllers showAudioModal={showAudioModal} />
        </footer>
    );
}

export default Footer;