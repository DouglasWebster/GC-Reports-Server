import { Test, TestingModule } from '@nestjs/testing';
import { CompFormController } from './comp-form.controller';

describe('CompFormController', () => {
  let controller: CompFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompFormController],
    }).compile();

    controller = module.get<CompFormController>(CompFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
