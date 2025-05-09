import { createMockUser } from '@lib/shared/mock';
import { IAccessTokenPayload, IPublicUserData } from '@lib/shared/models';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { JwtStrategyService } from './jwt-strategy.service';

describe('JwtStrategyService', () => {
  let service: JwtStrategyService;
  let mockUser: IPublicUserData;

  beforeAll(() => {
    process.env['JWT_SECRET'] = randPassword()[0];
    mockUser = createMockUser();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategyService, ConfigService],
    }).compile();

    service = module.get<JwtStrategyService>(JwtStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an access token payload object', async () => {
    const tokenPayload: IAccessTokenPayload = {
      sub: mockUser.id,
      email: mockUser.email,
    };

    const respData = await service.validate(tokenPayload);
    expect(respData).toStrictEqual({
      userId: mockUser.id,
      email: mockUser.email,
    });
  });
});
