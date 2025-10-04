import { useState } from "react";
import { useAudio } from "../../contexts/AudioProvider";
import "../../styles/PlaylistModal.css";
import SongPreview from "../SongPreview";

function PlaylistModal() {
    const { playlist, setAtIndexPlaylist } = useAudio();
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;

        setAtIndexPlaylist(draggedIndex, index);
        setDraggedIndex(null);
    };

    return (
        <div className="playlist-container">
            {playlist.length > 0 ? (
                playlist.map((song, index) => (
                    <div
                        key={song.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className="playlist-item"
                    >
                        <SongPreview
                            song={song}
                            isPlaylistModal={true}
                        />
                    </div>
                ))
            ) : (
                <h2 className="empty-playlist-title">Playlist is empty</h2>
            )}
        </div>
    );
}

export default PlaylistModal;
