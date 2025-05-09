import { InsertUser } from '@lib/shared/drizzle';
import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IPublicUserData } from '@lib/shared/models';
import { ReqUserId } from '@lib/shared/decorators';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(
    @ReqUserId() reqUserId: number,
    @Param('id', ParseUUIDPipe) id: number
  ): Promise<IPublicUserData> {
    if (reqUserId !== id) {
      throw new NotFoundException();
    }
    const { password, ...user } = await this.userService.getOne(id);
    return user;
  }

  @Post('')
  async createUser(@Body() userData: InsertUser): Promise<IPublicUserData> {
    const { userId, email } = (await this.userService.create(userData)).at(0);
    return { id: userId, email };
  }
}
