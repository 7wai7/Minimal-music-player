import type UserDTO from "../types/user";
import api from "./axios";
import fetcher from "./fetcher";

export async function artistFetch(login: string): Promise<UserDTO & { songsCount: number }> {
    return fetcher(
        api.get(`/api/users/by-login/${login}`)
    )
}

export async function artistsFetch(limit?: number): Promise<UserDTO[]> {
    return fetcher(
        api.get('/api/users', {
            params: {
                limit
            }
        })
    )
}