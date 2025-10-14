import { Body, Controller, Get, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReqUser } from 'src/decorators/ReqUser';
import { ApiLogin, ApiRegister } from 'src/docs/auth.decorators';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthGuard } from './auth.quard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
    tokenAge: number;

    constructor(private authService: AuthService) {
        this.tokenAge = 1000 * 60 * 60 * 24;
    }


    @ApiLogin()
    @Post("/login")
    async login(@Body() userDto: LoginUserDto, @Res() res: Response) {
        const { token, user } = await this.authService.login(userDto);

        // Set the JWT as an HttpOnly cookie for security
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: this.tokenAge // Cookie expiration in milliseconds (e.g., 1 hour)
        });

        return res.status(200).json(user);
    }



    @ApiRegister()
    @Post("/register")
    async register(@Body() userDto: RegisterUserDto, @Res() res: Response) {
        const { token, user } = await this.authService.register(userDto);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: this.tokenAge
        });

        return res.status(200).json(user);
    }

    @ApiOperation({
        summary: 'Вихід користувача із системи',
        description: 'Видаляє JWT токен з cookies, завершуючи сесію користувача.'
    })
    @Post("/logout")
    logout(@Res() res: Response) {
        this.authService.logout(res);
    }


    @UseGuards(AuthGuard)
    @Get('/me')
    me(@ReqUser() user: UserDto) {
        if (user) return {
            id: user.id,
            login: user.login,
            email: user.email,
        };
        throw new UnauthorizedException({ message: 'Unauthorized' });
    }
}
