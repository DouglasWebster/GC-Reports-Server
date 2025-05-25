import { InsertUser } from '@lib/shared/drizzle';
import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InferSelectModel } from 'drizzle-orm';
import { DatabaseError } from '../../db/database/database-error';
import { databaseSchema } from '../../db/database/database-schema';
import { DrizzleService } from '../../db/database/drizzle.service';
import { PostgresErrorCode } from '../../db/database/postgres-error-code.enum';
import { UserAlreadyExistsException } from './user-already-exists.exception';
import { UserService } from './user.service';

jest.mock('bcrypt', () => ({
  hash: () => {
    return Promise.resolve('hashed-password');
  },
}));

describe('UserService', () => {
  let userService: UserService;
  let findFirstMock: jest.Mock;
  let drizzleInsertValuesMock: jest.Mock;
  let drizzleInsertReturningMock: jest.Mock;
  let user: InferSelectModel<typeof databaseSchema.user>;
  let newUser: InsertUser;

  beforeEach(async () => {
    findFirstMock = jest.fn();
    drizzleInsertValuesMock = jest.fn().mockReturnThis();
    drizzleInsertReturningMock = jest.fn().mockResolvedValue([]);
    user = {
      id: 1,
      email: 'john@smith.com',
      name: 'John',
      password: 'strongPassword123',
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DrizzleService,
          useValue: {
            db: {
              query: {
                user: {
                  findFirst: findFirstMock,
                },
              },
              insert: jest.fn().mockReturnThis(),
              values: drizzleInsertValuesMock,
              returning: drizzleInsertReturningMock,
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('when the getById function is called', () => {
    describe('and the findFirst method returns the user', () => {
      it('should return the user', async () => {
        findFirstMock.mockResolvedValue(user);
        const result = await userService.getOne(user.id);
        expect(result).toBe(user);
      });
    });
    describe('and the findFirst method does not return the user', () => {
      it('should throw the NotFoundException', async () => {
        findFirstMock.mockResolvedValue(undefined);
        return expect(async () => {
          await userService.getOne(1);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when the getOneByEmail function is called', () => {
    describe('and the findFirst method returns the user', () => {
      it('should return the user', async () => {
        findFirstMock.mockResolvedValue(user);
        const result = await userService.getOneByEmail(user.email);
        expect(result).toBe(user);
      });
    });
    describe('and the findFirst method does not return the user', () => {
      it('should throw the NotFoundException', async () => {
        findFirstMock.mockResolvedValue(undefined);
        return expect(async () => {
          await userService.getOneByEmail('');
        }).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('when create function is called with a users details', () => {
    beforeEach(() => {
      newUser = {
        email: user.email,
        name: user.name,
        password: user.password,
      };
    });

    describe('and the user is a new user', () => {
      it('should insert the new user using the drizzle ORM', async () => {
        console.log(JSON.stringify(newUser));
        await userService.create(newUser);
        expect(drizzleInsertValuesMock).toHaveBeenCalledWith({
          ...newUser,
          password: 'hashed-password',
        });
      });
    });
  });

  describe('and the DrizzleService throws a UniqueViolation error', () => {
    beforeEach(() => {
      const databaseError: DatabaseError = {
        code: PostgresErrorCode.UniqueViolation,
        table: 'user',
        detail: 'Key (email)=(john@smith.com) already exists',
      };
      drizzleInsertReturningMock.mockImplementation(() => {
        throw databaseError;
      });
    });
    it('should throw the Confilct Exception', () => {
      return expect(async () => {
        await userService.create(user);
      }).rejects.toThrow(UserAlreadyExistsException);
    });
  });

  describe('and the DrizzleService throws an non DatabaseException', () => {
    beforeEach(() => {
      drizzleInsertReturningMock.mockImplementation(() => {
        throw new ImATeapotException
      })
    })
    it('should just return the exception', () => {
      return expect(async () => {
        await userService.create(user)
      }).rejects.toThrow(ImATeapotException)
    })
  })
});
