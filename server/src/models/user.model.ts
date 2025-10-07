import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, HasOne, Model, Sequelize, Table } from "sequelize-typescript";
import { Song } from "./song.model";
import { Profile } from "./profile.model";

interface UserCreationAttrs {
	login: string;
	email: string;
	password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
	@ApiProperty({
		example: 'john_doe',
		description: 'Унікальний логін користувача',
		minLength: 3,
		maxLength: 16
	})
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	declare login: string;


	@ApiProperty({
		example: 'john.doe@gmail.com',
		description: 'Унікальна електронна пошта користувача',
		format: 'email'
	})
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	declare email: string;


	@ApiProperty({
		example: 'SecurePassword123!',
		description: 'Хешований пароль користувача',
		minLength: 3,
		maxLength: 100,
		writeOnly: true
	})
	@Column({ type: DataType.STRING, allowNull: false })
	declare password: string;


	@Column({ type: DataType.VIRTUAL })
	declare isOwnProfile: boolean;

	static withOwnerProfile(currentUserId?: number) {
		if (!currentUserId) return {};
		return {
			attributes: {
				include: [
					[
						Sequelize.literal(`CASE WHEN "User"."id" = ${currentUserId} THEN true ELSE false END`),
						'isOwnProfile'
					]
				]
			}
		};
	}


	@HasOne(() => Profile, { as: 'profile' })
	profile: Profile;

	@HasMany(() => Song, { as: 'songs' })
	songs: Song[];
}