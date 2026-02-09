import { createMockUser } from '@lib/mocks';
import { IPublicUserData, IUser } from '@lib/shared/models';
import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleService } from '../../db/database/drizzle.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let findFirstMock: jest.Mock;
  beforeEach(async () => {
    findFirstMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
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
      controllers: [UserController],
    }).compile();
    service = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeTruthy();
  });
  it('should create a user', async () => {
    const user = createMockUser();
    const publicUser: IPublicUserData = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    jest.spyOn(service, 'create').mockReturnValue(
      Promise.resolve({
        email: user.email,
        userId: user.id,
        name: user.name,
      }),
    );
    const res = await controller.createUser({
      email: user.email,
      password: user.password,
      name: user.name,
    });
    expect(res).toStrictEqual(publicUser);
  });
  describe('when the GET /user/id is called', () => {
    describe('and the requester is authenticated', () => {
      let user1: IUser;
      let user2: IUser;
      beforeEach(() => {
        user1 = createMockUser();
        user2 = createMockUser();
      });
      describe('and the user with the given id exists', () => {
        it('should respond with the user details', async () => {
          const publicUser: IPublicUserData = {
            id: user1.id,
            email: user1.email,
            name: user1.name,
          };
          jest.spyOn(service, 'getOne').mockReturnValue(Promise.resolve(user1));
          const res = await controller.getUser(user1.id, publicUser.id);
          expect(res).toStrictEqual(publicUser);
        });
      });
      describe('and the user tries to access other user details', () => {
        it('should respond with a NotFoundException sayin status code 404 Message Not Found ', async () => {
          try {
            await controller.getUser(user1.id, user2.id);
          } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
          }
        });
      });
    });
  });
});
