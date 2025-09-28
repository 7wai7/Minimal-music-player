import type { JSX } from "react";
import { Link } from "react-router-dom";
import type UserDTO from "../types/user";

export default function Avatar(
    props: {
        user: UserDTO
    }
): JSX.Element {
    return <Link to={`/artist/${props.user.login}`} className="avatar-link">
        <img
            src={`/`}
            alt={`${props.user.login}`}
            className='avatar'
            onError={(e) => {
                e.currentTarget.onerror = null; // запобігає нескінченному циклу, якщо fallback теж не знайдеться
                e.currentTarget.src = "/default_profile.png"; // шлях до картинки "Фото не знайдено"
            }}
        />
    </Link>
}