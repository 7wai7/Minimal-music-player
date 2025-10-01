import { Link } from "react-router-dom";
import "../styles/Header.css"
import { useUser } from "../contexts/userContext";
import { ArrowLeft, Search } from "lucide-react";

interface Props {
    isOpenModal: boolean;
    closeModal: () => void;
}

function Header({
    isOpenModal,
    closeModal
}: Props) {
    const { user } = useUser();

    return (
        <header>
            <nav>
                {
                    isOpenModal &&
                    <button onClick={closeModal} className="nav-item icon-wrapper">
                        <ArrowLeft
                            size={16}
                            color="var(--theme-2)"
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                        />
                    </button>
                }
                <Link to={"/"} className="nav-item">
                    Home
                </Link>
                {
                    user
                        ? <Link to={`/artist/${user.login}`} className="nav-item">Profile</Link>
                        : <Link to={`/auth`} className="nav-item">Login</Link>
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

export default Header;