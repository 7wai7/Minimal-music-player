import { IsNumber } from "class-validator";
import { CreateSongDto } from "./create-song.dto";

export class SongDto extends CreateSongDto {
    @IsNumber()
    readonly id: number;
}
