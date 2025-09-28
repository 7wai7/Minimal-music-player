import type { AxiosResponse } from "axios";

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>; // для ValidationPipe
}

export default async function fetcher<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
    try {
        const response = await promise;
        return response.data;
    } catch (err: any) {
        console.log(err);
        if (err.response) {
            const apiError: ApiError = {
                message: err.response.data?.message || "Unknown error",
                status: err.response.status,
                errors: err.response.data?.errors,
            };
            throw apiError;
        } else {
            throw {
                message: err.message || "Network error",
                status: 0,
            } as ApiError;
        }
    }
}
