import { Inject, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from 'src/models/song.model';
import { SongDto } from './dto/song.dto';
import { FindOptions, Op } from 'sequelize';
import { User } from 'src/models/user.model';
import { StorageService } from 'src/storage/storage.service';
import { UploadSongDto } from './dto/upload-song.dto';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { UserDto } from 'src/users/dto/user.dto';

ffmpeg.setFfprobePath(ffprobeInstaller.path);

export async function getAudioMetadata(file: Express.Multer.File): Promise<ffmpeg.FfprobeData> {
	const tempPath = path.join(process.cwd(), `temp-${Date.now()}-${file.originalname}`);
	await fs.writeFile(tempPath, file.buffer); // зберігаємо тимчасово

	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(tempPath, async (err, metadata) => {
			try {
				await fs.unlink(tempPath); // видаляємо
			} catch (e) { }
			if (err) return reject(err);
			resolve(metadata);
		});
	});
}


@Injectable()
export class SongsService {
	songInclude = [
		{
			model: User,
			as: 'artist',
			attributes: ['id', 'login']
		}
	];

	constructor(
		private readonly storageService: StorageService,
	) { }

	async findOne(currentUserId: number | null, options: Partial<SongDto>) {
		const query: FindOptions<Song> = {
			where: { ...options },
			include: this.songInclude,
		};

		if (currentUserId) return await Song.scope(Song.withOwnership(currentUserId)).findOne(query);
		return await Song.findOne(query);
	}

	async findMany(currentUserId: number | null, options: Partial<SongDto>, limit = 10) {
		const query: FindOptions<Song> = {
			where: { ...options },
			include: this.songInclude,
			limit
		};

		if (currentUserId) return await Song.scope(Song.withOwnership(currentUserId)).findAll(query);
		return await Song.findAll(query);
	}

	async findManyByArtist(
		currentUserId: number | null,
		options: Partial<SongDto>,
		artistOptions: Partial<UserDto>,
		page = 1,
		limit = 10
	) {
		const query: FindOptions<Song> = {
			where: { ...options },
			include: [{
				model: User,
				as: 'artist',
				attributes: ['id', 'login'],
				where: { ...artistOptions }
			}],
			order: [['created_at', 'DESC']],
			offset: (page - 1) * limit,
			limit
		};

		if (currentUserId) return await Song.scope(Song.withOwnership(currentUserId)).findAndCountAll(query);
		return await Song.findAndCountAll(query);
	}


	async uploadAndCreate(currentUserId: number, createSongDto: UploadSongDto, file: Express.Multer.File) {
		const metadata = await getAudioMetadata(file);
		const { url } = await this.storageService.uploadFile(file);

		const fileData: {
			extension: string,
			size: number,
			url: string
		} = {
			extension: file.originalname.split('.').pop() || '',
			size: file.size,
			url,
		};

		return await this.create(
			{
				...createSongDto, ...fileData,
				artist_id: currentUserId,
				duration: Math.floor(metadata.format.duration || 0)
			}
		);
	}

	async create(createSongDto: CreateSongDto) {
		const song = await Song.create(createSongDto);
		return await Song.scope(Song.withOwnership(createSongDto.artist_id)).findByPk(song.id, {
			include: this.songInclude
		})
	}

	async findSongByTitle(currentUserId: number, title: string, limit: number = 8) {
		return await Song.scope(Song.withOwnership(currentUserId)).findAll({
			where: {
				title: {
					[Op.iLike]: `%${title}%`
				}
			},
			include: this.songInclude,
			order: [['login', 'ASC']],
			limit
		})
	}
}
