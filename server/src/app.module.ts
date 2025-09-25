import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Song } from './models/song.model';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { JwtModule } from '@nestjs/jwt';
dotenv.config();

@Module({
	imports: [
		SequelizeModule.forRoot({
			dialect: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			models: [
				User,
				Song
			],
			autoLoadModels: true,
			synchronize: true,
		}),
		UsersModule,
		SongsModule,
		JwtModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
