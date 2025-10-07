import { Link } from "react-router-dom";
import formatBytes from "../../utils/formatBytes";
import formatDuration from "../../utils/formatDuration";
import "../../styles/AudioModal.css"
import Img from "../ui/Img";
import { useModalStore } from "../../stores/ModalStore";
import Tabs from "../Tabs";
import { useAudioStore } from "../../stores/AudioStore";
import type SongDTO from "../../types/song";


function AudioModal() {
    const song = useModalStore(state => state.audioSong);

    if (!song) return <p className="placeholder">No song playing</p>

    return <>
        <div className="disc-container">
            <div className='disc-wrapper preview-img-wrapper'>
                <Img
                    fileUrl={song.preview_url}
                    defaultUrl="/disc-album-cover.png"
                    alt={song.title}
                    className="preview-img spin-animation"
                />
            </div>
        </div>

        <Tabs
            tabs={[
                {
                    navBtn: <button>
                        Info
                    </button>,
                    content: <SongMeta song={song} />
                },
                {
                    navBtn: <button>
                        Lyrics
                    </button>,
                    content: (
                        <div className="lyrics">{song.lyrics?.trim() ? song.lyrics : "This song does not contain lyrics"}</div>
                    )
                }
            ]}
        />
    </>
}

function SongMeta({
    song
}: {
    song: SongDTO
}) {
    const currentSong = useAudioStore(s => s.currentSong);
    const playSong = useAudioStore(s => s.playSong);

    return (
        <>
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
            </div>
            {
                currentSong?.id !== song.id && (
                    <button className="play-btn" onClick={() => playSong(song)}>Play</button>
                )
            }
        </>
    )
}

export default AudioModal;