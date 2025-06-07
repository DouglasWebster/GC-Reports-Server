import { Test, TestingModule } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleService } from '../../db/database/drizzle.service';
import { TeeService } from './tee.service';


describe('TeesService', () => {
  let service: TeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeeService,
        {
          provide: DrizzleService,
          useValue: drizzle.mock(),
        }
      ],
    }).compile();

    service = module.get<TeeService>(TeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
