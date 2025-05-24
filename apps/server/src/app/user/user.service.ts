import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// import * as schema from '@lib/shared/drizzle';
import { InsertUser, user } from '@lib/shared/drizzle';
import { IUser } from '@lib/shared/models';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../db/database/drizzle.service';
import { isDatabaseError } from '../../db/database/database-error';
import { PostgresErrorCode } from '../../db/database/postgres-error-code.enum';
import { UserAlreadyExistsException } from './user-already-exists.exception';

@Injectable()
export class UserService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getOne(id: number): Promise<IUser> {
    const found = await this.drizzleService.db.query.user.findFirst({
      where: eq(user.id, id),
    });
    if (!found) {
      throw new NotFoundException(`User could not not found`);
    }
    return found;
  }

  async getOneByEmail(email: string): Promise<IUser> {
    const found = await this.drizzleService.db.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (!found) {
      throw new NotFoundException(
        `User with email '${email}' could not not found`
      );
    }
    return found;
  }

  async create(newUser: InsertUser) {
    // const existingUser = await this.drizzleService.db
    //   .select({ email: user.email })
    //   .from(user)
    //   .where(eq(user.email, newUser.email));
    // if (existingUser.length > 0) {
    //   throw new BadRequestException(`User '${newUser.email}' already exists`);
    // }

    const { email, password, name } = newUser;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const createUsers = await this.drizzleService.db
        .insert(user)
        .values({ email, password: hashedPassword, name })
        .returning({ userId: user.id, email: user.email, name: user.name });

      return createUsers.pop();
    } catch (error) {
      if (
        isDatabaseError(error) &&
        error.code === PostgresErrorCode.UniqueViolation
      ) {
        throw new UserAlreadyExistsException(email);
      }
      throw error;
    }
  }
}
