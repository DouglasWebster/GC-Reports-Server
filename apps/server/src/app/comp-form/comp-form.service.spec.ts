import { Test, TestingModule } from '@nestjs/testing';
import { CompFormService } from './comp-form.service';
import { DrizzleService } from '../../db/database/drizzle.service';
describe('CompFormService', () => {
  let compFormService: CompFormService;
  let findFirstMock: jest.Mock;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompFormService,
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
    compFormService = module.get<CompFormService>(CompFormService);
  });
  it('should be defined', () => {
    expect(compFormService).toBeDefined();
  });
});
