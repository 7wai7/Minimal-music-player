import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/models/user.model';
import HttpExceptionField from 'src/exeptions/HttpExceptionField';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async login(userDto: LoginUserDto) {
        const user = await this.userService.findOne({ login: userDto.login});
        
        if (!user) {
            throw new HttpExceptionField([
                {
                    field: 'login',
                    message: "A user does not exists."
                }
            ]);
        }

        const plainUser = user.get({ plain: true });
        const result = await bcrypt.compare(userDto.password, plainUser.password);

        if (!result) {
            throw new HttpExceptionField([
                {
                    field: 'password',
                    message: "A password is not correct."
                }
            ]);
        }

        return this.generateToken(plainUser);
    }

    async register(userDto: RegisterUserDto) {
        const existedLogin = await this.userService.findOne({ login: userDto.login});
        if (existedLogin) {
            throw new HttpExceptionField([
                {
                    field: 'login',
                    message: "A user with this login exists."
                }
            ]);
        }

        const existedEmail = await this.userService.findOne({ email: userDto.email});
        if (existedEmail) {
            throw new HttpExceptionField([
                {
                    field: "email",
                    message: "A user with this email address exists."
                }
            ]);
        }

        const hash = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.create({ ...userDto, password: hash });
        return this.generateToken(user.get({ plain: true }));
    }
    
    logout(res: Response) {
        res.clearCookie('token');
        res.end();
    }

    generateToken(user: User) {
        const userData = { id: user.id, email: user.email, login: user.login };
        return {
            token: this.jwtService.sign(userData),
            user: userData
        };
    }
}
