import { Link, useLocation } from "react-router-dom";
import type SongDTO from "../../types/song";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { songFetch } from "../../API/songs";
import { useAudio } from "../../contexts/AudioProvider";
import formatBytes from "../../utils/formatBytes";
import formatDuration from "../../utils/formatDuration";
import Loader from "../Loader";
import "../../styles/AudioModal.css"
import Img from "../Img";


interface Props {
    id?: number | string,
    song?: SongDTO;
}

function AudioModal({
    id,
    song: transmittedSong
}: Props) {
    const location = useLocation();
    const { currentSong, playSong } = useAudio();

    const { data: loadedSong, isLoading, error } = useQuery({
        queryKey: ['song', id],
        queryFn: () => songFetch(id!),
        enabled: !!id && location.pathname.startsWith("/song") && currentSong?.id !== +id
        // enabled: isOpen && !!id && (+id !== transmittedSong?.id)
    })

    useEffect(() => {
        if (loadedSong && currentSong?.id !== loadedSong.id) {
            playSong(loadedSong);
        }
    }, [loadedSong]);



    // if (!transmittedSong) {
    if (error) return <h2 className="fetch-error-message">{error.message}</h2>;
    if (isLoading) return <Loader />;
    // }

    const song = useMemo(
        () => loadedSong ?? transmittedSong ?? currentSong,
        [loadedSong, transmittedSong, currentSong?.id]
    );

    if (!song) return <p>No song playing</p>

    return <>
        <div className="disc-container">
            <div className='disc-wrapper'>
                <Img
                    fileUrl={song.preview_url}
                    originalname={song.title}
                    defaultUrl="/disc-album-cover.png"
                    alt={song.title}
                    className="disc-cover-img spin-animation"
                />
            </div>
        </div>
        <div className="song-meta">
            <div className="top">
                <Link className='artist' to={`/artist/${song.artist.login}`}>
                    {song.artist.login}
                </Link>
                <span className='w'>-</span>
                <span className="song-title">{song.title}</span>
            </div>
            <span className='w'>Time: <span className='p'>{formatDuration(song.duration)}</span></span>
            <span className='w'>SIze: <span className='p'>{formatBytes(song.size)}</span></span>
            <span className='w'>Release date: <span className='p'>{new Date(song.release_date).toLocaleDateString()}</span></span>
            <div className="lyrics">{song.lyrics}</div>
        </div>
    </>
}

export default AudioModal;