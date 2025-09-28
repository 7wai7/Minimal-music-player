import { useQuery } from "@tanstack/react-query";
import { songsFetch } from "../API/songs";
import SongPreview from "./SongPreview";
import Loader from "./Loader";

function SongsContainer() {
    const { data: songs = [], isLoading, error } = useQuery({
        queryKey: ['songs'],
        queryFn: () => {
            return songsFetch(10);
        },
    });

    if (isLoading) return <Loader />
    if (error) return (
        <h2 className="fetch-error-message">
            {error.message}
        </h2>
    )

    return (
        <div className="songs-container">
            {songs.map((s) => {
                return <SongPreview key={s.id} song={s} />
            })}
        </div>
    );
}

export default SongsContainer;