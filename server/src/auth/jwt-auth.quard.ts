import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AUTH_KEY, AuthOptions } from 'src/decorators/Auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const options = this.reflector.get<AuthOptions>(
            AUTH_KEY,
            context.getHandler(),
        );

        const req = context.switchToHttp().getRequest();

        // якщо декоратор не вказаний — за замовчуванням авторизація потрібна
        const required = options?.required ?? true;

        const token = req.cookies['token'];

        if (!token) {
            if (required) {
                throw new UnauthorizedException({ message: 'Unauthorized' });
            } else {
                // дозволяємо анонімів
                return true;
            }
        }

        try {
            const user = this.jwtService.verify(token);
            req.user = user;

            // якщо вказані ролі
            // if (options?.roles && options.roles.length > 0) {
            //     if (!options.roles.includes(user.role)) {
            //         throw new ForbiddenException({ message: 'Access denied' });
            //     }
            // }

            return true;
        } catch (error) {
            if (required) {
                throw new UnauthorizedException({ message: 'Unauthorized' });
            }
            return true;
        }
    }
}
