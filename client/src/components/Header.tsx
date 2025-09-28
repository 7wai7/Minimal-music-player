import { Link } from "react-router-dom";
import "../styles/Header.css"
import { useUser } from "../contexts/userContext";

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
            </nav>
        </header>
    );
}

export default Header;