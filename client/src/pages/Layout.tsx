import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AudioProvider } from "../contexts/AudioProvider";
import Modal from "../components/Modal";

interface Props {
    previousLocation: any
}

function Layout({
    previousLocation
}: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    const isOpenModal = !!(previousLocation || location.pathname.startsWith("/song"));

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
                    isOpen={isOpenModal}
                    id={location.pathname.split('/').pop()}
                // song={song}
                />

                <Header
                    isOpenModal={isOpenModal}
                    closeModal={closeModal}
                />
                <main className="page-content">
                    <Outlet />
                </main>
                <Footer
                    isOpenModal={isOpenModal}
                    closeModal={closeModal}
                />
            </div>
        </AudioProvider>
    );
}

export default Layout;
