import { useQuery } from "@tanstack/react-query";
import SongPreview from "./SongPreview";
import Loader from "./Loader";
import type SongDTO from "../types/song";

interface Props {
    queryKey?: unknown[],
    queryFn: (...arg0: any[]) => Promise<SongDTO[]>,
    enabled?: boolean
}

function SongsContainer({
    queryKey = [],
    queryFn,
    enabled = true
}: Props) {
    const { data: songs = [], isLoading, error } = useQuery({
        queryKey: ["songs", ...queryKey],
        queryFn: () => queryFn(),
        enabled
    });

    if (isLoading) return <Loader />;
    if (error) return <h2 className="fetch-error-message">{(error as Error).message}</h2>;

    return (
        <div className="songs-container">
            {songs.map((s) => (
                <SongPreview key={s.id} song={s} />
            ))}
        </div>
    );
}

export default SongsContainer;
