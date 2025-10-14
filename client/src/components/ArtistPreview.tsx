import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import type UserDTO from "../types/user";
import "../styles/ArtistPreview.css"

interface Props {
    artist: UserDTO
}

function ArtistPreview({
    artist
}: Props) {
    return (
        <div className="artist-preview">
            <Avatar
                src={artist.profile.avatar_url}
                alt={artist.login}
                linkTo={`/artist/${artist.login}`}
            />
            <Link to={`/artist/${artist.login}`} className="title">
                <span>{artist.login}</span>
            </Link>
        </div>
    );
}

export default ArtistPreview;