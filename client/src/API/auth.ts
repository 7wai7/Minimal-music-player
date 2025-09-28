import type AuthData from "../types/authData";
import type UserDTO from "../types/user";
import api from "./axios";
import fetcher from "./fetcher";

export async function authFetch(body: AuthData, isSignup: boolean): Promise<UserDTO> {
    return fetcher(
        api.post(`/api/auth/${isSignup ? 'register' : 'login'}`, isSignup ? body : {...body, email: undefined}, {
            headers: {
                "Content-Type": "application/json",
            }
        })
    );
}

export async function fetchMe(): Promise<UserDTO> {
    return fetcher(
        api.get('/api/auth/me')
    );
}

export async function fetchLogout(): Promise<void> {
    return fetcher(
        api.post('/api/auth/logout')
    );
}