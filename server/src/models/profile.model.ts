import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

interface ProfileCreationAttrs {
	artist_id: number;
	avatar_url?: string;
}

@Table({ tableName: 'profile', timestamps: false })
export class Profile extends Model<Profile, ProfileCreationAttrs> {
	@ForeignKey(() => User)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare artist_id: number;

	@Column({ type: DataType.STRING, allowNull: true })
	declare avatar_url: string;


	@BelongsTo(() => User, { as: 'artist' })
	artist: User;
}