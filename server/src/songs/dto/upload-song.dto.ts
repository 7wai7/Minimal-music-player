import { IsDate, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";

export class UploadSongDto {
    @ApiProperty({
        description: 'Title of the song',
        minLength: 3,
        maxLength: 100,
        example: "My Song"
    })
    @Length(3, 100, {
        message: 'The title must be between 3 and 100 characters long.'
    })
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: 'Lyrics of the song',
        minLength: 3,
        maxLength: 5000,
        example: "These are the song lyrics..."
    })
    @IsOptional()
    @Length(3, 5000, {
        message: 'The lyrics name must be between 3 and 5000 characters long.'
    })
    @IsString()
    readonly lyrics?: string;

    @ApiProperty({
        description: 'Release date of the song',
        type: Date,
        required: false,
        example: new Date().toISOString(),
    })
    @IsOptional()
    @IsDate()
    readonly release_date?: Date;

    @ApiProperty({
        description: 'Genre of the song',
        minLength: 2,
        maxLength: 30,
        example: "Pop"
    })
    @Length(2, 30, {
        message: 'The genre must be between 2 and 30 characters long.'
    })
    @IsString()
    readonly genre: string;
}