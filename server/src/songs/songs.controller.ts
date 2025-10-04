import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query, HttpException, HttpStatus, UploadedFiles } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { ReqUser } from 'src/decorators/ReqUser';
import { UserDto } from 'src/users/dto/user.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.quard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadSongDto } from './dto/upload-song.dto';
import { Auth } from 'src/decorators/Auth';
import { Op } from 'sequelize';
import clean from 'src/utils/clean';
import { SongDto } from './dto/song.dto';

@Controller('songs')
export class SongsController {
	constructor(private readonly songsService: SongsService) { }

	@ApiOperation({ summary: 'Find song' })
	@ApiResponse({ status: 200, description: 'The song has been successfully retrieved.' })
	@UseGuards(JwtAuthGuard)
	@Auth({ required: false })
	@Get('/by-id/:id')
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

	@ApiOperation({ summary: 'Find songs' })
	@ApiQuery({
		name: 'page',
		type: 'number',
		example: '1'
	})
	@ApiQuery({
		name: 'id',
		type: 'number',
		example: '1',
		required: false
	})
	@ApiQuery({
		name: 'login',
		type: 'string',
		example: 'user',
		required: false
	})
	@ApiQuery({
		name: 'limit',
		type: 'number',
		example: '10',
		required: false
	})
	@ApiResponse({
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
	@UseGuards(JwtAuthGuard)
	@Auth({ required: false })
	@Get('/artist')
	findManyByArtist(
		@Query('page') page: string,
		@ReqUser() user?: UserDto,
		@Query('id') id?: string,
		@Query('login') login?: string,
		@Query('limit') limit?: string
	) {
		if (!id && !login) throw new HttpException('Either id or login is required', HttpStatus.BAD_REQUEST);

		return this.songsService.findManyByArtist(
			user?.id ?? null,
			{},
			clean({
				id: id ? +id : undefined,
				login
			}),
			+page,
			limit ? +limit : 10
		);
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
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'file', maxCount: 1 },
			{ name: 'file_preview', maxCount: 1 },
		]),
	)
	uploadAndCreate(
		@ReqUser() user: UserDto,
		@Body() createSongDto: UploadSongDto,
		@UploadedFiles()
		files: {
			file?: Express.Multer.File[];
			file_preview?: Express.Multer.File[];
		},
	) {
		const file = files.file?.[0];
		const file_preview = files.file_preview?.[0];

		if (!file?.mimetype.startsWith('audio/')) {
			throw new Error('Invalid file type. Only audio files are allowed.');
		}

		if (file_preview && !file_preview.mimetype.startsWith('image/')) {
			throw new Error('Invalid file preview type. Only image files are allowed.');
		}
		return this.songsService.uploadAndCreate(user.id, createSongDto, file, file_preview);
	}

	// @ApiOperation({ summary: 'Create a new song' })
	// @ApiResponse({ status: 201, description: 'The song has been successfully created.' })
	// @ApiResponse({ status: 400, description: 'Bad Request.' })
	// @ApiBody({ type: CreateSongDto })
	// @UseGuards(JwtAuthGuard)
	// @Post()
	// create(@Body() createSongDto: CreateSongDto, @ReqUser() user: UserDto) {
	// 	return this.songsService.create({ ...createSongDto, artist_id: user.id });
	// }
}
