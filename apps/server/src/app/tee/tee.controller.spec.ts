import { Test, TestingModule } from '@nestjs/testing';
import { TeeController } from './tee.controller';
import { TeeService } from './tee.service';
import { DrizzleService } from '../../db/database/drizzle.service';
import { drizzle } from 'drizzle-orm/node-postgres';
describe('TeesController', () => {
  let controller: TeeController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeeController],
      providers: [
        TeeService,
        {
          provide: DrizzleService,
          useValue: {
            db: drizzle.mock(),
          },
        },
      ],
    }).compile();
    controller = module.get<TeeController>(TeeController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
