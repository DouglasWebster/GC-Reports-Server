import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { IPublicUserData, ITokenResponse } from '@lib/shared/models';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async validateUser(
    email: string,
    password: string
  ): Promise<IPublicUserData | null> {
    const user = await this.userService.getOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.debug(`User '${email}' authenticated successfully`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...publicUserData } = user;
      return publicUserData;
    }
    return null;
  }

  async generateAccessToken(user: IPublicUserData): Promise<ITokenResponse> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
