import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Song } from "./song.model";

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
	login: string;


	@ApiProperty({
		example: 'john.doe@gmail.com',
		description: 'Унікальна електронна пошта користувача',
		format: 'email'
	})
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	email: string;


	@ApiProperty({
		example: 'SecurePassword123!',
		description: 'Хешований пароль користувача',
		minLength: 3,
		maxLength: 100,
		writeOnly: true
	})
	@Column({ type: DataType.STRING, allowNull: false })
	password: string;



	@ApiProperty({
		description: 'Список пісень, створених користувачем',
		type: () => [Song],
		required: false
	})
	@HasMany(() => Song, { as: 'somgs' })
	songs: Song[];
}