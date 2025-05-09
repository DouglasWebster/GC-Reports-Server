import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// import * as schema from '@lib/shared/drizzle';
import { InsertUser, user } from '@lib/shared/drizzle';
import * as schema from '@lib/shared/drizzle';
import { IUser } from '@lib/shared/models';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async getOne(id: number): Promise<IUser> {
    const found = this.database.query.user.findFirst({
      where: eq(user.id, id),
    });
    if (!user) {
      throw new NotFoundException(`User could not not found`);
    }
    return found;
  }

  async getOneByEmail(email: string): Promise<IUser> {
    const found = this.database.query.user.findFirst({
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
    const existingUser = await this.database
      .select({ email: user.email })
      .from(user)
      .where(eq(user.email, newUser.email));
    if (existingUser.length > 0) {
      throw new BadRequestException(`User '${newUser.email}' already exists`);
    }

    const { email, password } = newUser;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.database
      .insert(user)
      .values({ email, password: hashedPassword })
      .returning({ userId: user.id, email: user.email });
  }
}
