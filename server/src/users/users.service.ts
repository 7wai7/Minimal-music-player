import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from 'src/models/user.model';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {

    async create(dto: RegisterUserDto) {
        return await User.create(dto);
    }

    async findOne(options: Partial<UserDto>) {
        return await User.findOne({
            where: { ...options },
            attributes: ['id', 'login']
        });
    }

    async findMany(options: {}, limit = 10) {
        return await User.findAll({
            where: { ...options },
            attributes: ['id', 'login'],
            limit
        });
    }

    async findUsersByLogin(currentUserId: number, login: string, limit: number = 8) {
        return await User.findAll({
            where: {
                id: {
                    [Op.ne]: currentUserId
                },
                login: {
                    [Op.iLike]: `%${login}%`
                }
            },
            attributes: ['id', 'login'],
            order: [['login', 'ASC']],
            limit
        })
    }
}
