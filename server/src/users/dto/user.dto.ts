import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ example: 1 })
    readonly id: number;

    @ApiProperty({ example: 'john_doe' })
    readonly login: string;

    @ApiProperty({ example: 'john.doe@gmail.com' })
    readonly email: string;

    @ApiProperty({ example: 'SecurePassword123!' })
    readonly password: string;
}