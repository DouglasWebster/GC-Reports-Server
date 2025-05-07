import { ITokenResponse, IUpdateUser } from '@lib/shared/models';
import { BadRequestException, Body, Controller, Get, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './skip-auth';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    @SkipAuth()
    async login(@Body() {email, password}: IUpdateUser): Promise<ITokenResponse> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new BadRequestException('Email or password is invalid');
        }
        return await this.authService.generateAccessToken(user);
    }
}
