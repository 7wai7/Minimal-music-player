import { Link } from "react-router-dom";
import formatBytes from "../../utils/formatBytes";
import formatDuration from "../../utils/formatDuration";
import "../../styles/AudioModal.css"
import Img from "../Img";
import { useModalStore } from "../../stores/ModalStore";
import Tabs from "../Tabs";


function AudioModal() {
    const song = useModalStore(state => state.audioSong);

    if (!song) return <p>No song playing</p>

    return <>
        <div className="disc-container">
            <div className='disc-wrapper preview-img-wrapper'>
                <Img
                    fileUrl={song.preview_url}
                    originalname={song.title}
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
                    content: (
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
                    )
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

export default AudioModal;