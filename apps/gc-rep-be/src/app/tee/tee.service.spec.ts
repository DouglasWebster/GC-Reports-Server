import { Test, TestingModule } from '@nestjs/testing';
import { TeeService } from './tee.service';

describe('TeesService', () => {
  let service: TeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeeService],
    }).compile();

    service = module.get<TeeService>(TeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
