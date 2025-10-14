import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user.dto";


export function ApiGetUserByIdDocs() {
    return applyDecorators(
        ApiOperation({ summary: 'Get user by ID' }),
        ApiParam({ name: 'id', type: Number, description: 'User ID' }),
        ApiResponse({
            status: 200,
            description: 'The user has been successfully retrieved.',
            type: UserDto,
        }),
    );
}

export function ApiGetUserByLoginDocs() {
    return applyDecorators(
        ApiOperation({ summary: 'Get user by login' }),
        ApiParam({ name: 'login', type: String, description: 'User login' }),
        ApiResponse({
            status: 200,
            description: 'The user has been successfully retrieved.',
            type: UserDto,
        }),
    );
}


export function ApiGetUsersDocs() {
    return applyDecorators(
        ApiOperation({ summary: 'Get users' }),
        ApiParam({ name: 'limit', type: Number }),
        ApiResponse({
            status: 200,
            description: 'The users has been successfully retrieved.',
            type: [UserDto]
        })
    )
}


export function ApiFindUsersByLoginDocs() {
    return applyDecorators(
        ApiOperation({ summary: 'Find users by login' }),
        ApiBearerAuth(),
        ApiParam({ name: 'login', type: String, description: 'User login', required: false }),
        ApiResponse({
            status: 200,
            description: 'List of users matching the login',
            type: UserDto
        })
    )
}


export function ApiChangeAvatarDocs() {
    return applyDecorators(
        ApiOperation({ summary: 'Change avatar' }),
        ApiBearerAuth(),
        ApiBody({
            description: 'Form data with image',
            type: File
        })
    )
}