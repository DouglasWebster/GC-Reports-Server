import { Test, TestingModule } from '@nestjs/testing';
import { CompFormController } from './comp-form.controller';
import { CompFormService } from './comp-form.service';
import { DrizzleService } from '../../db/database/drizzle.service';
import { drizzle } from 'drizzle-orm/node-postgres';
describe('CompFormController', () => {
  let controller: CompFormController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompFormController],
      providers: [
        CompFormService,
        { provide: DrizzleService, useValue: { db: drizzle.mock() } },
      ],
    }).compile();
    controller = module.get<CompFormController>(CompFormController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
