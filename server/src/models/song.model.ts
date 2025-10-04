import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from "sequelize-typescript";
import { User } from "./user.model";

interface CreationAttrs {
    artist_id: number;
    title: string;
    lyrics?: string;
    release_date?: Date;
    genre: string;
    duration: number;
    size: number;
    extension: string;
    url: string;
    preview_url?: string;
}

@Table({ tableName: 'songs', timestamps: false })
export class Song extends Model<Song, CreationAttrs> {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare artist_id: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare title: string;

    @Column({ type: DataType.TEXT })
    declare lyrics: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') })
    declare release_date: Date;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare genre: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare duration: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare size: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare extension: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare url: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare preview_url: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') })
    declare created_at: Date;


    @Column({ type: DataType.VIRTUAL })
    declare isOwnSong: boolean;

    static withOwnership(currentUserId: number) {
        return {
            attributes: {
                include: [
                    [
                        Sequelize.literal(`CASE WHEN "Song"."artist_id" = ${currentUserId} THEN true ELSE false END`),
                        'isOwnSong'
                    ]
                ]
            }
        };
    }

    @BelongsTo(() => User, { as: 'artist' })
    artist: User;
}