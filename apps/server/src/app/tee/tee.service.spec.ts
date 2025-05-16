import { Test, TestingModule } from '@nestjs/testing';
import { TeeService } from './tee.service';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import { drizzle } from 'drizzle-orm/node-postgres';

describe('TeesService', () => {
  let service: TeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeeService,
        {
          provide: DATABASE_CONNECTION,
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
