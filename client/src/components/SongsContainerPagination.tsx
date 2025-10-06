import { useQuery } from "@tanstack/react-query";
import SongPreview from "./SongPreview";
import Loader from "./Loader";
import type SongDTO from "../types/song";
import { useState } from "react";
import Pagination from "./Pagination";

interface Props {
    queryKey?: unknown[],
    queryFn: ({
        page,
        limit
    }: {
        page: number,
        limit: number
    }) => Promise<
        {
            count: number,
            rows: SongDTO[]
        }
    >,
    enabled?: boolean,
    queryFnArgs?: {},
    pageLimit: number
}

function SongsContainerPagination({
    queryKey = [],
    queryFn,
    enabled = true,
    queryFnArgs = {},
    pageLimit = 10
}: Props) {
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: songs = { count: 0, rows: [] },
        isLoading,
        error,
    } = useQuery({
        queryKey: ["songs", currentPage, ...queryKey],
        queryFn: () => queryFn({
            page: currentPage,
            limit: pageLimit,
            ...queryFnArgs
        }),
        enabled,
        // keepPreviousData: true,
    });

    if (isLoading) return <Loader />;
    if (error) return <h2 className="fetch-error-message">{(error as Error).message}</h2>;

    return (
        <>
            <div className="songs-container">
                {songs.rows.map((s) => (
                    <SongPreview
                        key={s.id}
                        song={s}
                        listKey={`${queryKey.join(' ')} ${currentPage}`}
                        list={songs.rows}
                    />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                maxItems={songs.count}
                pageLimit={pageLimit}
            />
        </>
    );
}

export default SongsContainerPagination;
