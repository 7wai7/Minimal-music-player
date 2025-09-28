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
            <Avatar user={artist} />
            <Link to={`/artist/${artist.id}`}>
                <span className="title">{artist.login}</span>
            </Link>
        </div>
    );
}

export default ArtistPreview;