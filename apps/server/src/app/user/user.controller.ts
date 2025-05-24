import { ReqUserId } from '@lib/shared/decorators';
import { InsertUser } from '@lib/shared/drizzle';
import { IPublicUserData } from '@lib/shared/models';
import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SkipAuth } from '../auth/skip-auth';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(
    @ReqUserId() reqUserId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<IPublicUserData> {
    if (reqUserId !== id) {
      throw new NotFoundException();
    }
    const { password, ...user } = await this.userService.getOne(id);
    return user;
  }

  @Post('')
  @SkipAuth()
  async createUser(@Body() userData: InsertUser): Promise<IPublicUserData> {
    const { userId, email, name } = await this.userService.create(userData);
    return { id: userId, email, name };
  }
}
