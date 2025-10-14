import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { SongDto } from "src/songs/dto/song.dto";


export function ApiGetSongById() {
    return applyDecorators(
        ApiOperation({ summary: 'Find song' }),
        ApiResponse({ status: 200, description: 'The song has been successfully retrieved.' })
    )
}

export function ApiGetSongs() {
    return applyDecorators(
        ApiOperation({ summary: 'Find songs' }),
        ApiResponse({ status: 200, description: 'The songs has been successfully retrieved.' })
    )
}

export function ApiGetByArtist() {
    return applyDecorators(
        ApiOperation({ summary: 'Find songs' }),
        ApiQuery({
            name: 'page',
            type: 'number',
            example: '1'
        }),
        ApiQuery({
            name: 'id',
            type: 'number',
            example: '1',
            required: false
        }),
        ApiQuery({
            name: 'login',
            type: 'string',
            example: 'user',
            required: false
        }),
        ApiQuery({
            name: 'limit',
            type: 'number',
            example: '10',
            required: false
        }),
        ApiResponse({
            status: 200,
            description: 'The songs has been successfully retrieved.',
            schema: {
                type: 'object',
                properties: {
                    count: { type: 'number', example: 100 },
                    rows: {
                        type: 'array',
                        items: { $ref: getSchemaPath(SongDto) }
                    }
                }
            }
        })
    )
}

export function ApiUploadAndCreate() {
    return applyDecorators(
        ApiOperation({ summary: 'Upload and create a new song with audio file' }),
        ApiResponse({ status: 201, description: 'The song has been successfully uploaded and created.' }),
        ApiResponse({ status: 400, description: 'Invalid file type.' }),
        ApiConsumes('multipart/form-data'),
        ApiBody({
            description: 'Form data for creating a song and uploading an audio file',
            schema: {
                type: 'object',
                properties: {
                    title: { type: 'string', description: 'Song title', example: "My Song" },
                    lyrics: { type: 'string', description: 'Song lyrics', example: "These are the song lyrics..." },
                    release_date: { type: 'string', format: 'date', description: 'Release date of the song', example: new Date().toISOString() },
                    genre: { type: 'string', description: 'Genre of the song', example: "Pop" },
                    file: {
                        type: 'string',
                        format: 'binary',
                        description: 'Audio file to upload'
                    }
                },
                required: ['file', 'title', 'genre']
            }
        })
    )
}