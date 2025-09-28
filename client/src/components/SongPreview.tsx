import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import type SongDTO from "../types/song";
import type React from "react";
import PlayBtn from "./PlayBtn";

interface Props {
    song: SongDTO
}

function SongPreview({
    song
}: Props) {
    const click = (e: React.MouseEvent) => {
        const target = e.target;

        console.log('navigate')
    }

    return (
        <div className="song-preview" onClick={click}>
            <PlayBtn />
            <div className="meta">
                <span className="artist-name">{song.artist.login}</span>
                <span>-</span>
                <span className="song-title">{song.title}</span>
            </div>
            <span className="duration">{song.duration}</span>
            
        </div>
    );
}

export default SongPreview;