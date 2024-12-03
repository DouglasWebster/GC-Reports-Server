import { Test, TestingModule } from '@nestjs/testing';
import { CompFormService } from './comp-form.service';

describe('CompFormService', () => {
  let service: CompFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompFormService],
    }).compile();

    service = module.get<CompFormService>(CompFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
