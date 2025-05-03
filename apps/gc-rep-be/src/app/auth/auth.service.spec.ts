import { createMockUser } from '@lib/mocks';
import { IUser } from '@lib/shared/models';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUser: IUser;
  let mockUserUnhashedPassword: string;

  beforeAll(async () => {
    mockUser = createMockUser();
    mockUserUnhashedPassword = mockUser.password;
    mockUser.password = await bcrypt.hash(mockUserUnhashedPassword, 10);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: randPassword()[0],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getOneByEmail: jest.fn(async (email, password) => {
              if (email !== mockUser.email) {
                return null;
              }
              return mockUser;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should validate a user', async () => {
    const validUser = await service.validateUser(
      mockUser.email,
      mockUserUnhashedPassword
    );
    expect(validUser).toStrictEqual({
      id: mockUser.id,
      email: mockUser.email
    });
  });

  it('should return null for an invalid user', async () => {
    const invalidUser = await service.validateUser('foo', 'bar');
    expect(invalidUser).toBeNull();
  });

  it('should generate an access token', async () => {
    const { access_token } = await service.generateAccessToken(mockUser);
    expect(access_token).toBeDefined();
    expect(typeof access_token).toBe('string');
    // console.debug('access_token', access_token);
  });
});
