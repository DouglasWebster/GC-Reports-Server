import { Test, TestingModule } from '@nestjs/testing';
import { TeeController } from './tee.controller';

describe('TeesController', () => {
  let controller: TeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeeController],
    }).compile();

    controller = module.get<TeeController>(TeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
