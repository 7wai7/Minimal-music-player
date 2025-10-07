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

export async function changeAvatarFetch(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return fetcher(
        api.post('/api/users/change-avatar', formData)
    )
}