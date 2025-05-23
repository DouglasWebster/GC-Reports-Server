import { createMockUser } from '@lib/shared/mock';
import { IAccessTokenPayload, IPublicUserData } from '@lib/shared/models';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { JwtStrategy } from './jwt-strategy.service';

describe('JwtStrategyService', () => {
  let service: JwtStrategy;
  let mockUser: IPublicUserData;

  beforeAll(() => {
    process.env['JWT_SECRET'] = randPassword()[0];
    mockUser = createMockUser();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy, ConfigService],
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an access token payload object', async () => {
    const tokenPayload: IAccessTokenPayload = {
      sub: mockUser.id.toString(),
      email: mockUser.email,
      name: mockUser.name,
    };

    const respData = await service.validate(tokenPayload);
    expect(respData).toStrictEqual({
      userId: mockUser.id.toString(),
      email: mockUser.email,
      name: mockUser.name,
    });
  });
});
