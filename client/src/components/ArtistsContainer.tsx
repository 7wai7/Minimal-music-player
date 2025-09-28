import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import { artistsFetch } from "../API/artists";
import ArtistPreview from "./ArtistPreview";

function ArtistsContainer() {
    const { data: artists = [], isLoading, error } = useQuery({
        queryKey: ['artists'],
        queryFn: () => {
            return artistsFetch(10);
        },
    });

    if (isLoading) return <Loader />
    if (error) return (
        <h2 className="fetch-error-message">
            {error.message}
        </h2>
    )

    return (
        <div className="artists-container">
            {artists.map((a) => {
                return <ArtistPreview key={a.id} artist={a} />
            })}
        </div>
    );
}

export default ArtistsContainer;