import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionService } from './competition.service';
import { DrizzleService } from '../../db/database/drizzle.service';
import { drizzle } from 'drizzle-orm/node-postgres';
describe('CompetitionService', () => {
  let service: CompetitionService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionService,
        {
          provide: DrizzleService,
          useValue: {
            db: drizzle.mock(),
          },
        },
      ],
    }).compile();
    service = module.get<CompetitionService>(CompetitionService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
