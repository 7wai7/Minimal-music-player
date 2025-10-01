import type SongDTO from '../types/song';
import { Link, useLocation } from 'react-router-dom';
import formatDuration from '../utils/formatDuration';
import "../styles/Modal.css"
import { songFetch } from '../API/songs';
import { useQuery } from '@tanstack/react-query';
import Loader from './Loader';
import { memo, useEffect } from 'react';
import { useAudio } from '../contexts/AudioProvider';
import formatBytes from '../utils/formatBytes';

interface Props {
    isOpen: boolean;
    id?: number | string,
    song?: SongDTO;
}

const Modal = ({
    isOpen,
    id,
    song: transmittedSong
}: Props) => {
    const location = useLocation();
    const { currentSong, playSong } = useAudio();

    const { data: loadedSong, isLoading, error } = useQuery({
        queryKey: ['song', id],
        queryFn: () => songFetch(id!),
        enabled: !currentSong && !!id && location.pathname.startsWith("/song")
        // enabled: isOpen && !!id && (+id !== transmittedSong?.id)
    })

    useEffect(() => {
        if (loadedSong) {
            playSong(loadedSong);
        }
    }, [loadedSong]);

    // console.log("render modal");


    const render = () => {
        // if (!transmittedSong) {
        if (error) return <h2 className="fetch-error-message">{error.message}</h2>;
        if (isLoading) return <Loader />;
        // }

        const song = loadedSong ?? transmittedSong ?? currentSong;
        if (!song) return <p>No song playing</p>


        return <>
            <div className="disc-container">
                <div className='disc-wrapper'>
                    <img src="/disc-album-cover.png" alt={`${song.title} by ${song.artist.login}`} className="disc-cover-img spin-animation" />
                </div>
            </div>
            <div className="song-meta">
                <div className="top">
                    <Link className='artist' to={`/artist/${song.artist.login}`}>
                        {song.artist.login}
                    </Link>
                    <span>-</span>
                    <span className="song-title">{song.title}</span>
                </div>
                <span>Time: <span className='p'>{formatDuration(song.duration)}</span></span>
                <span>SIze: <span className='p'>{formatBytes(song.size)}</span></span>
                <span>Release date: <span className='p'>{new Date(song.release_date).toLocaleDateString()}</span></span>
                <div className="lyrics">{song.lyrics}</div>
            </div>
        </>
    }

    // return ReactDOM.createPortal(
    return <div className={`modal-overlay ${isOpen ? "show" : "hidden"}`}>
        <div className='modal-content'>
            {render()}
        </div>
    </div>
    // document.getElementById('modal-root')!
    // );
};

export default memo(Modal);