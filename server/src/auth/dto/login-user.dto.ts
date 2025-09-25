import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginUserDto {
    @Length(3, 16, {
        message: 'The login must be between 3 and 16 characters long.'
    })
    @IsString()
    @ApiProperty({ example: 'john_doe' })
    readonly login: string;

    @Length(3, 100, {
        message: 'The password must be between 3 and 100 characters long.'
    })
    @IsString()
    @ApiProperty({ example: 'SecurePassword123!' })
    readonly password: string;
}
