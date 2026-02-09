import { Test, TestingModule } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleService } from '../../db/database/drizzle.service';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';
describe('CompetitionController', () => {
  let controller: CompetitionController;
  let service: CompetitionService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionService,
        {
          provide: DrizzleService,
          useValue: drizzle.mock(),
        },
      ],
      controllers: [CompetitionController],
    }).compile();
    service = module.get<CompetitionService>(CompetitionService);
    controller = module.get<CompetitionController>(CompetitionController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeTruthy();
  });
});
