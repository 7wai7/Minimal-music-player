import { ApiProperty } from "@nestjs/swagger";
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
}

@Table({ tableName: 'songs', timestamps: false })
export class Song extends Model<Song, CreationAttrs> {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    artist_id: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT })
    lyrics: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') })
    release_date: Date;

    @Column({ type: DataType.TEXT, allowNull: false })
    genre: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    duration: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    size: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    extension: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    url: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') })
    created_at: Date;


    @Column({ type: DataType.VIRTUAL })
    isOwnSong: boolean;

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