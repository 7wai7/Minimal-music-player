import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto extends LoginUserDto {
    @IsEmail({}, {
        message: 'Invalid email format.'
    })
    @IsString()
    @ApiProperty({ example: 'john.doe@gmail.com' })
    readonly email: string;
}
