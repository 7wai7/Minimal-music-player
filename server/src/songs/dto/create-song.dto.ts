import { IsDate, IsNumber, IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { UploadSongDto } from "./upload-song.dto";

export class CreateSongDto extends UploadSongDto {
    @ApiProperty({
        description: 'ID of the artist',
        type: Number,
        example: 1
    })
    @IsNumber()
    readonly artist_id: number;

    @ApiProperty({
        description: 'Duration of the song in seconds',
        type: Number,
        example: 240
    })
    @IsNumber()
    readonly duration: number;

    @ApiProperty({
        description: 'Size of the song file in bytes',
        type: Number,
        example: 5120000
    })
    @IsNumber()
    readonly size: number;

    @ApiProperty({
        description: 'File extension of the song',
        minLength: 1,
        maxLength: 10,
        example: "mp3"
    })
    @Length(1, 10, {
        message: 'The extension must be between 1 and 10 characters long.'
    })
    @IsString()
    readonly extension: string;

    @ApiProperty({
        description: 'URL to access the song',
        minLength: 3,
        maxLength: 255,
        example: "https://example.com/songs/my-song.mp3"
    })
    @Length(3, 255, {
        message: 'The url must be between 3 and 255 characters long.'
    })
    @IsString()
    readonly url: string;
}
