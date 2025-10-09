import "../styles/Main.css";
import SongsContainer from "../components/SongsContainer";
import ArtistsContainer from "../components/ArtistsContainer";
import { songsFetch } from "../API/songs";

function Main() {
    return (
        <>
            <h2 className="artists-title">Popular artists</h2>
            <ArtistsContainer />
            <h2 className="songs-title">Popular songs</h2>
            <div className="songs-list-wrapper">
                <SongsContainer
                    queryFn={() => songsFetch(10)}
                />
            </div>
        </>
    );
}

export default Main;
