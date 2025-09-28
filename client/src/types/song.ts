import type UserDTO from "./user";

export default interface SongDTO {
    id: number;
    artist: UserDTO;
    isOwnSong: boolean;
    title: string;
    lyrics?: string;
    release_date: Date;
    genre: string;
    duration: number;
    size: number;
    extension: string;
    url: string;
}