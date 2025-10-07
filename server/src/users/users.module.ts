import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { Song } from 'src/models/song.model';
import { AuthModule } from 'src/auth/auth.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Song]),
    AuthModule,
    StorageModule
  ],
  exports: [UsersService],
})
export class UsersModule { }
