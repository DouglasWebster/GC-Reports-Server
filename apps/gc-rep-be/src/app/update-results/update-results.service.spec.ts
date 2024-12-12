import { Test, TestingModule } from '@nestjs/testing';
import { UpdateResultsService } from './update-results.service';

describe('UpdateResultsService', () => {
  let service: UpdateResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateResultsService],
    }).compile();

    service = module.get<UpdateResultsService>(UpdateResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
