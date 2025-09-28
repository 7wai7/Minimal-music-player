import { SetMetadata } from '@nestjs/common';

export const AUTH_KEY = 'auth';

export interface AuthOptions {
    required?: boolean;
    // roles?: string[];
}

export const Auth = (options: AuthOptions = { required: true }) =>
    SetMetadata(AUTH_KEY, options);
