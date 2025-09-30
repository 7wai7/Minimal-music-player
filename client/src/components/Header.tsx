import { Link } from "react-router-dom";
import "../styles/Header.css"
import { useUser } from "../contexts/userContext";
import { Search } from "lucide-react";

function Header() {
    const { user } = useUser();

    return (
        <header>
            <nav>
                <Link to={"/"}>
                    <span>Home</span>
                </Link>
                {
                    user
                        ? <Link to={`/artist/${user.id}`}>
                            <span>Profile</span>
                        </Link>
                        : <Link to={`/auth`}>
                            <span>Login</span>
                        </Link>
                }
                <button className="search-btn icon-wrapper">
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