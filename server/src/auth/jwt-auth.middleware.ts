import {
    Injectable,
    NestMiddleware
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies['token'] || req.headers['authorization']?.split(' ')[1];

        if (token) {
            try {
                const user = this.jwtService.verify(token);
                req['user'] = user;
            } catch (e) {
                console.error('JWT error:', e.message);
            }
        }

        return next();
    }
}
