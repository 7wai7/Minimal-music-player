import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { ReqUser } from 'src/decorators/ReqUser';
import { UserDto } from 'src/users/dto/user.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.quard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSongDto } from './dto/upload-song.dto';
import { Auth } from 'src/decorators/Auth';

@Controller('songs')
export class SongsController {
	constructor(private readonly songsService: SongsService) { }

	@ApiOperation({ summary: 'Find song' })
	@ApiResponse({ status: 200, description: 'The song has been successfully retrieved.' })
	@UseGuards(JwtAuthGuard)
	@Auth({ required: false })
	@Get(':id')
	findOne(@Param('id') id: string, @ReqUser() user?: UserDto) {
		return this.songsService.findOne(user?.id ?? null, { id: +id });
	}

	@ApiOperation({ summary: 'Find songs' })
	@ApiResponse({ status: 200, description: 'The songs has been successfully retrieved.' })
	@UseGuards(JwtAuthGuard)
	@Auth({ required: false })
	@Get()
	findMany(@Param('limit') limit?: string, @ReqUser() user?: UserDto) {
		return this.songsService.findMany(user?.id ?? null, {}, limit ? +limit : 10);
	}

	@ApiOperation({ summary: 'Upload and create a new song with audio file' })
	@ApiResponse({ status: 201, description: 'The song has been successfully uploaded and created.' })
	@ApiResponse({ status: 400, description: 'Invalid file type.' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
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
	@Post("/upload-and-create")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	uploadAndCreate(
		@ReqUser() user: UserDto,
		@Body() createSongDto: UploadSongDto,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file.mimetype.startsWith('audio/')) {
			throw new Error('Invalid file type. Only audio files are allowed.');
		}
		return this.songsService.uploadAndCreate(user.id, createSongDto, file);
	}

	@ApiOperation({ summary: 'Create a new song' })
	@ApiResponse({ status: 201, description: 'The song has been successfully created.' })
	@ApiResponse({ status: 400, description: 'Bad Request.' })
	@ApiBody({ type: CreateSongDto })
	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() createSongDto: CreateSongDto, @ReqUser() user: UserDto) {
		return this.songsService.create({ ...createSongDto, artist_id: user.id });
	}
}
