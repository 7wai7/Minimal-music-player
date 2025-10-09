import { Outlet, useLocation } from "react-router-dom";

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
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default Layout;
