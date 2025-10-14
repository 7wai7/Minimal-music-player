import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Song } from './models/song.model';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { JwtModule } from '@nestjs/jwt';
import { StorageModule } from './storage/storage.module';
import { Profile } from './models/profile.model';
import { JwtMiddleware } from './auth/jwt-auth.middleware';
import { AuthModule } from './auth/auth.module';
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
				Profile,
				Song
			],
			autoLoadModels: true,
			synchronize: true,
			logging: false
		}),
		UsersModule,
		SongsModule,
		JwtModule,
		AuthModule,
		StorageModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(JwtMiddleware).forRoutes('*');
	}
}
