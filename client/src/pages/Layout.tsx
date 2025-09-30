import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AudioProvider } from "../contexts/AudioProvider";

function Layout() {
    const location = useLocation();

    return (
        <AudioProvider>
            <div className={(location.pathname.split('/')[1] || "main") + "-page page"}>
                <Header />
                <main className="page-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </AudioProvider>
    );
}

export default Layout;
