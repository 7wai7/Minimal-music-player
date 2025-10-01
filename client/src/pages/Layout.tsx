import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AudioProvider } from "../contexts/AudioProvider";
import Modal from "../components/Modal";
import AudioModal from "../components/modals/AudioModal";
import UploadModal from "../components/modals/UploadModal";
import type { ModalType } from "../types/modal";
import PlaylistModal from "../components/modals/PlaylistModal";

interface Props {
    previousLocation: any,
    modalType?: ModalType
}

function Layout({
    previousLocation,
    modalType
}: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    console.log(modalType);
    

    const isOpenAudioModal = !!(modalType == "audio" || location.pathname.startsWith("/song"));
    const isOpenUploadModal = !!(modalType === "upload" || location.pathname.split("/")[3] === "upload");
    const isOpenPlaylistModal = !!(modalType === "playlist" || location.pathname.startsWith("/playlist"));

    const closeModal = () => {
        if (previousLocation) {
            navigate(previousLocation.pathname);
        } else {
            navigate("/");
        }
    }

    return (
        <AudioProvider>
            <div className={(location.pathname.split('/')[1] || "main") + "-page page"}>
                <Modal
                    isOpen={isOpenAudioModal}
                    className="audio"
                >
                    <AudioModal
                        id={location.pathname.split('/').pop()}
                    // song={song}
                    />
                </Modal>

                <Modal
                    isOpen={isOpenUploadModal}
                    className="upload"
                >
                    <UploadModal />
                </Modal>

                <Modal
                    isOpen={isOpenPlaylistModal}
                    className="playlist"
                >
                    <PlaylistModal />
                </Modal>

                <Header
                    isOpenModal={isOpenAudioModal || isOpenUploadModal || isOpenPlaylistModal}
                    closeModal={closeModal}
                />
                <main className="page-content">
                    <Outlet />
                </main>
                <Footer
                    isOpenAudioModal={isOpenAudioModal}
                    isOpenPlaylistModal={isOpenPlaylistModal}
                    closeModal={closeModal}
                />
            </div>
        </AudioProvider>
    );
}

export default Layout;
