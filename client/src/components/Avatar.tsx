import { useState, type JSX } from "react";
import { Link } from "react-router-dom";
import type UserDTO from "../types/user";
import { User } from "lucide-react";

interface Props {
    user: UserDTO,
    useLink?: boolean
}

export default function Avatar({
    user,
    useLink = true
}: Props): JSX.Element {
    const [imgNotFound, setImgNotFound] = useState(false);

    const getImg = () => {
        return imgNotFound
            ? <User
                size={"40%"}
                color="var(--theme-2)"
            />
            : <img
                src={`/`}
                alt={`${user.login}`}
                className='avatar'
                onError={(e) => {
                    e.currentTarget.onerror = null; // запобігає нескінченному циклу, якщо fallback теж не знайдеться
                    // e.currentTarget.src = "/default_profile.png"; // шлях до картинки "Фото не знайдено"
                    setImgNotFound(true);
                }}
            />
    }

    if (!useLink) {
        return <>
            <div className={`${imgNotFound ? "avatar-wrapper icon-wrapper default" : "avatar-wrapper icon-wrapper"}`}>
                {getImg()}
            </div>
        </>
    }

    return <Link to={`/artist/${user.login}`} className={`${imgNotFound ? "avatar-wrapper avatar-link default icon-wrapper" : "avatar-wrapper avatar-link"}`}>
        {getImg()}
    </Link>
}