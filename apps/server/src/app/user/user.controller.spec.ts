import { Test, TestingModule } from '@nestjs/testing';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createMockUser } from '@lib/mocks';
import { IPublicUserData } from '@lib/shared/models';

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
          provide: DATABASE_CONNECTION,
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
    };
    jest
      .spyOn(service, 'create')
      .mockReturnValue(
        Promise.resolve([{ email: user.email, userId: user.id }])
      );
    const res = await controller.createUser({
      email: user.email,
      password: user.password,
    });
    expect(res).toStrictEqual(publicUser);
  });

  it('should get user details if authenticated', async () => {
    const user = createMockUser();
    const publicUser: IPublicUserData = {
      id: user.id,
      email: user.email,
    };
    jest.spyOn(service, 'getOne').mockReturnValue(Promise.resolve(user));
    const res = await controller.getUser(user.id, user.id);
    expect(res).toStrictEqual(publicUser);
  });
});
