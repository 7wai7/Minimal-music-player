import "../styles/Main.css";
import SongsContainer from "../components/SongsContainer";
import ArtistsContainer from "../components/ArtistsContainer";

function Main() {
    return (
        <>
            <h1 className="artists-title">Popular artists</h1>
            <div className="artists-list-wrapper">
                <ArtistsContainer />
            </div>
            <h1 className="songs-title">Popular songs</h1>
            <div className="songs-list-wrapper">
                <SongsContainer />
            </div>
        </>
    );
}

export default Main;
