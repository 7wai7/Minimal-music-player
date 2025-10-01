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
                    <div className="nav-item">
                        <button onClick={closeModal} className="icon-wrapper">
                            <ArrowLeft
                                size={16}
                                color="var(--theme-2)"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                            />
                        </button>
                    </div>
                }
                <div className="nav-item">
                    <Link to={"/"}>
                        Home
                    </Link>
                </div>
                <div className="nav-item">
                    {
                        user
                            ? <Link to={`/artist/${user.login}`}>Profile</Link>
                            : <Link to={`/auth`}>Login</Link>
                    }
                </div>
                <div className="nav-item">
                    <button className="search-btn icon-wrapper">
                        <Search
                            size={16}
                            color="var(--theme-2)"
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                        />
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Header;