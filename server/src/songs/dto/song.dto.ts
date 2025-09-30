import { CreateSongDto } from "./create-song.dto";

export class SongDto extends CreateSongDto {
    readonly id: number;
    readonly created_at: string;
}
