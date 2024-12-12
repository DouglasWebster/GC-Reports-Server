import { Test, TestingModule } from '@nestjs/testing';
import { UpdateResultController } from './update-result.controller';

describe('UpdateResultController', () => {
  let controller: UpdateResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateResultController],
    }).compile();

    controller = module.get<UpdateResultController>(UpdateResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
