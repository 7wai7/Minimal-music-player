import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from 'src/models/user.model';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { FindOptions, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Song } from 'src/models/song.model';

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

    async findOneAndCountSongs(currentUserId: number | undefined, options: Partial<UserDto>) {
        const user = await User.scope(User.withOwnerProfile(currentUserId)).findOne({
            where: { ...options },
            attributes: [
                'id',
                'login',
                'isOwnProfile',
                [Sequelize.fn('COUNT', Sequelize.col('songs.id')), 'songsCount']
            ],
            include: [
                {
                    model: Song,
                    as: 'songs',
                    attributes: [] // щоб не підтягувати всі пісні
                }
            ],
            group: ['User.id']
        });

        if (!user) return null;
        user.setDataValue('isOwnProfile', user.id === currentUserId);
        return user;
    }

    async findMany(options: {}, limit = 10) {
        return await User.findAll({
            where: { ...options },
            attributes: ['id', 'login'],
            order: [['created_at', 'DESC']],
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
