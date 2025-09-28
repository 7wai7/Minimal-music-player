import type UserDTO from "../types/user";
import api from "./axios";
import fetcher from "./fetcher";

export async function artistsFetch(limit?: number): Promise<UserDTO[]> {
    return fetcher(
        api.get('/api/users', {
            params: {
                limit
            }
        })
    )
}