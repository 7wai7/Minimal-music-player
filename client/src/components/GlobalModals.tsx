import { createPortal } from "react-dom";
import AudioModal from "./modals/AudioModal";
import PlaylistModal from "./modals/PlaylistModal";
import UploadModal from "./modals/UploadModal";
import Modal from "./modals/Modal";

export default function GlobalModals() {
    
    return createPortal(
        <>
            <Modal
                type="audio"
            >
                <AudioModal
                    // id={location.pathname.split('/').pop()}
                />
            </Modal>

            <Modal
                type="upload"
            >
                <UploadModal />
            </Modal>

            <Modal
                type="playlist"
            >
                <PlaylistModal />
            </Modal>
        </>,
        document.getElementById('root')!
    );
}