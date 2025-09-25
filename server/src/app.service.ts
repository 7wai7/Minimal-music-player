import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { SongsService } from './songs/songs.service';

@Injectable()
export class AppService {
	constructor(
		private readonly usersService: UsersService,
		private readonly songsService: SongsService
	) { }

	async search(currentUserId: number, searchTerm: string) {
		return [
			...(await this.usersService.findUsersByLogin(currentUserId, searchTerm)),
			...(await this.songsService.findSongByTitle(searchTerm))
		];
	}
}
