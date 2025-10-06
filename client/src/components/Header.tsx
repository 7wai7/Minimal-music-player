import { Link } from "react-router-dom";
import "../styles/Header.css"
import { useUser } from "../contexts/userContext";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useModalStore } from "../stores/ModalStore";

function Header() {
    const { user } = useUser();
    const close = useModalStore.getState().close;

    return (
        <header>
            <nav>
                <NavReturnBtn />
                <Link to={"/"} className="nav-item" onClick={close}>
                    Home
                </Link>
                {
                    user
                        ? <Link to={`/artist/${user.login}`} onClick={close} className="nav-item">Profile</Link>
                        : <Link to={`/auth`} onClick={close} className="nav-item">Login</Link>
                }
                <button className="nav-item search-btn icon-wrapper">
                    <Search
                        size={16}
                        color="var(--theme-2)"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
                </button>
            </nav>
        </header>
    );
}

function NavReturnBtn() {
    const close = useModalStore.getState().close;
    const ref = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const unsubscribe = useModalStore.subscribe((state) => {
            if (!ref.current) return;
            
            if (state.audio || state.upload || state.playlist) {
                ref.current.classList.remove("hide");
            }
            else ref.current.classList.add("hide");
        });
        return unsubscribe;
    }, []);

    return (
        <>
            <button ref={ref} onClick={close} className="nav-item return-btn hide icon-wrapper">
                <ArrowLeft
                    size={16}
                    color="var(--theme-2)"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                />
            </button>
        </>
    )
}

export default Header;