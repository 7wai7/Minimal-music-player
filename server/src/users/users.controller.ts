import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.quard';
import { ReqUser } from 'src/decorators/ReqUser';
import { UserDto } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@ApiOperation({ summary: 'Get user by ID' })
	@ApiParam({ name: 'id', type: Number, description: 'User ID' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully retrieved.',
		type: UserDto
	})
	@Get("/id/:id")
	findOne(
		@Param('id') id: string
	) {
		return this.usersService.findOne({ id: +id });
	}

	@ApiOperation({ summary: 'Get user by login' })
	@ApiParam({ name: 'login', type: String, description: 'User login' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully retrieved.',
		type: UserDto
	})
	@Get('/by-login/:login')
	findOneByLogin(@Param('login') login: string) {
		return this.usersService.findOneAndCountSongs({ login });
	}

	@ApiOperation({ summary: 'Get users' })
	@ApiParam({ name: 'limit', type: Number })
	@ApiResponse({
		status: 200,
		description: 'The users has been successfully retrieved.',
		type: [UserDto]
	})
	@Get()
	findMany(@Param('limit') limit?: string) {
		return this.usersService.findMany({ }, limit ? +limit : 10);
	}

	@ApiOperation({ summary: 'Find users by login' })
	@ApiBearerAuth()
	@ApiParam({ name: 'login', type: String, description: 'User login', required: false })
	@ApiResponse({
		status: 200,
		description: 'List of users matching the login',
		type: UserDto
	})
	@UseGuards(JwtAuthGuard)
	@Get('find/by-login')
	findUsersByLogin(@ReqUser() user: UserDto, @Param('login') login: string) {
		return this.usersService.findUsersByLogin(user.id, login);
	}
}
