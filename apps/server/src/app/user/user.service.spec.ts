import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InferSelectModel } from 'drizzle-orm';
import { databaseSchema } from '../../db/database/database-schema';
import { DrizzleService } from '../../db/database/drizzle.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let findFirstMock: jest.Mock;

  beforeEach(async () => {
    findFirstMock = jest.fn();
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
      let user: InferSelectModel<typeof databaseSchema.user>;
      beforeEach(() => {
        user = {
          id: 1,
          email: 'john@smith.com',
          name: 'John',
          password: 'strongPassword123',
        };
        findFirstMock.mockResolvedValue(user);
      });
      it('should return the user', async () => {
        const result = await userService.getOne(user.id);
        expect(result).toBe(user);
      });
    });
    describe('and the findFirst method does not return the user', () => {
      beforeEach(() => {
        findFirstMock.mockResolvedValue(undefined);
      });
      it('should throw the NotFoundException', async () => {
        return expect(async () => {
          await userService.getOne(1);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});