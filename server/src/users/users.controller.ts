import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.quard';
import { ReqUser } from 'src/decorators/ReqUser';
import { ApiChangeAvatarDocs, ApiFindUsersByLoginDocs, ApiGetUserByIdDocs, ApiGetUserByLoginDocs, ApiGetUsersDocs } from 'src/docs/users.decorators';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@ApiGetUserByIdDocs()
	@Get("/id/:id")
	findOne(
		@Param('id') id: string
	) {
		return this.usersService.findOne({ id: +id });
	}

	@ApiGetUserByLoginDocs()
	@Get('/by-login/:login')
	findOneByLogin(
		@Param('login') login: string,
		@ReqUser() user?: UserDto,
	) {
		return this.usersService.findOneAndCountSongs(user?.id, { login });
	}

	@ApiGetUsersDocs()
	@Get()
	findMany(@Param('limit') limit?: string) {
		return this.usersService.findMany({}, limit ? +limit : 10);
	}

	@ApiFindUsersByLoginDocs()
	@Get('find/by-login')
	findUsersByLogin(@ReqUser() user: UserDto, @Param('login') login: string) {
		return this.usersService.findUsersByLogin(user.id, login);
	}



	@ApiChangeAvatarDocs()
	@Post("/change-avatar")
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	uploadAndCreate(
		@ReqUser() user: UserDto,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file.mimetype.startsWith('image/')) {
			throw new Error('Invalid file type. Only image files are allowed.');
		}

		return this.usersService.changeAvatar(user.id, file);
	}
}
