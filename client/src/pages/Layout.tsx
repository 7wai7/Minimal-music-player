import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Layout() {
    const location = useLocation();

    // const closeModal = useCallback(() => {
    //     if (isOpenPlaylistModal) setIsOpenPlaylistModal(false);
    //     else if (previousLocation) {
    //         navigate(previousLocation.pathname);
    //     } else {
    //         navigate("/");
    //     }
    // }, [previousLocation]);

    return (
        <>
            <div className={(location.pathname.split('/')[1] || "main") + "-page page"}>
                <Header />
                <main className="page-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
}

export default Layout;
