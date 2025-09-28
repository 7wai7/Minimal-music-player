import type SongDTO from "../types/song";
import api from "./axios";
import fetcher from "./fetcher";

export async function songFetch(id: number, limit?: number): Promise<SongDTO> {
    return fetcher(
        api.get(`/api/songs/${id}`, {
            params: {
                limit
            }
        })
    )
}

export async function songsFetch(limit?: number): Promise<SongDTO[]> {
    return fetcher(
        api.get('/api/songs', {
            params: {
                limit
            }
        })
    )
}

export async function songsArtistFetch(id: number, limit?: number): Promise<SongDTO[]> {
    return fetcher(
        api.get(`/api/songs/artist/${id}`, {
            params: {
                limit
            }
        })
    )
}