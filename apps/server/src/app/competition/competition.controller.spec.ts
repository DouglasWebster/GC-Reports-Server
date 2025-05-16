import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import { drizzle } from 'drizzle-orm/node-postgres';

describe('CompetitionController', () => {
  let controller: CompetitionController;
  let service: CompetitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionService,
        {
          provide: DATABASE_CONNECTION,
          useValue: drizzle.mock()
        }
      ],
      controllers: [CompetitionController],
    }).compile();

    service = module.get<CompetitionService>(CompetitionService);
    controller = module.get<CompetitionController>(CompetitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
