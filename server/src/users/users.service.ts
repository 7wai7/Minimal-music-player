import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from 'src/models/user.model';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { FindOptions, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Song } from 'src/models/song.model';
import { Profile } from 'src/models/profile.model';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class UsersService {
    userInclude = [
        {
            model: Profile,
            as: 'profile',
        }
    ];

    constructor(
        private readonly storageService: StorageService,
    ) { }

    async create(dto: RegisterUserDto) {
        const user = await User.create(dto);
        await Profile.create({
            artist_id: user.id
        })

        return user;
    }

    async findOne(options: Partial<UserDto>) {
        return await User.findOne({
            where: { ...options },
            include: this.userInclude,
            attributes: ['id', 'login']
        });
    }

    async findOneAndCountSongs(currentUserId: number | undefined, options: Partial<UserDto>) {
        const user = await User.findOne({
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
                },
                ...this.userInclude
            ],
            group: ['User.id', 'profile.id']
        });

        if (!user) return null;
        user.setDataValue('isOwnProfile', user.id === currentUserId);
        return user;
    }


    async findMany(options: {}, limit = 10) {
        return await User.findAll({
            where: { ...options },
            attributes: ['id', 'login'],
            include: this.userInclude,
            order: [['createdAt', 'DESC']],
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



    async changeAvatar(currentUserId: number, file: Express.Multer.File) {
        const profile = await Profile.findOne({ where: { artist_id: currentUserId } });
        if (profile) {
            if (profile.avatar_url) {
                const filename = profile.avatar_url.split("/").pop();
                if (filename) await this.storageService.deleteFile(filename);
            }
            const { url } = await this.storageService.uploadFile(file);
            await profile.update({ avatar_url: url });
            return { url };
        } else {
            throw new Error('Profile not found');
        }
    }
}
