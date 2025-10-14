import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.quard';
import { ReqUser } from 'src/decorators/ReqUser';
import { ApiGetByArtist, ApiGetSongById, ApiGetSongs, ApiUploadAndCreate } from 'src/docs/songs.decorators';
import { UserDto } from 'src/users/dto/user.dto';
import clean from 'src/utils/clean';
import { UploadSongDto } from './dto/upload-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
	constructor(private readonly songsService: SongsService) { }

	@ApiGetSongById()
	@Get('/by-id/:id')
	findOne(@Param('id') id: string, @ReqUser() user?: UserDto) {
		return this.songsService.findOne(user?.id ?? null, { id: +id });
	}

	@ApiGetSongs()
	@Get()
	findMany(@Param('limit') limit?: string, @ReqUser() user?: UserDto) {
		return this.songsService.findMany(user?.id ?? null, {}, limit ? +limit : 10);
	}

	@ApiGetByArtist()
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

	@ApiUploadAndCreate()
	@Post("/upload-and-create")
	@UseGuards(AuthGuard)
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
}
