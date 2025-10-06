import { useParams } from "react-router-dom";
import "../styles/Artist.css"
import Avatar from "../components/Avatar";
import { useQuery } from "@tanstack/react-query";
import { artistFetch } from "../API/artists";
import Loader from "../components/Loader";
import { songsArtistFetch } from "../API/songs";
import SongsContainerPagination from "../components/SongsContainerPagination";
import { useUser } from "../contexts/userContext";
import { useModalStore } from "../stores/ModalStore";

function Artist() {
    const { login } = useParams();
    const { logout } = useUser();

    const { data: artist, isLoading, error } = useQuery({
        queryKey: ['artist', login],
        queryFn: () => artistFetch(login!),
        enabled: !!login
    })

    if (error) return (
        <h2 className="fetch-error-message">
            {error.message}
        </h2>
    )
    if (isLoading || !artist) return <Loader />

    const showModal = () => {
        useModalStore.getState().toggle("upload");
    }

    return (
        <>
            <div className="page-top">
                <Avatar user={artist} useLink={false} />
                <div className="meta">
                    <span className="name">{artist.login}</span>
                    <span className="songs-count">Songs: {artist.songsCount || 0}</span>

                    {
                        artist.isOwnProfile && (
                            <div className="profile-controllers">
                                <button className="upload-song-btn tr-bg" onClick={showModal}>
                                    Upload song
                                </button>
                                <button className="logout-btn tr-bg" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
            <SongsContainerPagination
                queryKey={[login]}
                queryFn={songsArtistFetch}
                enabled={!!login}
                queryFnArgs={{ login }}
                pageLimit={10}
            />
        </>
    );
}

export default Artist;