import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { RegisterUserDto } from "src/auth/dto/register-user.dto";
import { ValidationDto } from "src/auth/dto/validation-dto";
import { UserDto } from "src/users/dto/user.dto";


export function ApiLogin() {
    return applyDecorators(
        ApiOperation({
            summary: 'Вхід користувача в систему',
            description: 'Аутентифікація користувача за допомогою логіну та паролю. Повертає JWT токен у httpOnly cookie та дані користувача.'
        }),
        ApiBody({
            description: 'Дані для входу користувача',
            type: LoginUserDto
        }),
        ApiResponse({
            status: 200,
            description: 'Успішний вхід в систему',
            type: UserDto
        }),
        ApiResponse({
            status: 400,
            description: 'Помилка валідації даних',
            type: [ValidationDto]
        })
    )
}


export function ApiRegister() {
    return applyDecorators(
        ApiOperation({
            summary: 'Реєстрація користувача в систему',
            description: 'Аутентифікація користувача за допомогою логіну/email та паролю. Повертає JWT токен у httpOnly cookie та дані користувача.'
        }),
        ApiBody({
            description: 'Дані для реєстрації користувача',
            type: RegisterUserDto
        }),
        ApiResponse({
            status: 200,
            description: 'Успішна реєстрація',
            type: UserDto
        }),
        ApiResponse({
            status: 400,
            description: 'Помилка валідації даних',
            type: [ValidationDto]
        })
    )
}