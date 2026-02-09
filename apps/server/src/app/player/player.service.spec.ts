import { Test, TestingModule } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleService } from '../../db/database/drizzle.service';
import { PlayerService } from './player.service';
describe('PlayerService', () => {
  let playerService: PlayerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: DrizzleService, useValue: drizzle.mock() },
      ],
    }).compile();
    playerService = module.get<PlayerService>(PlayerService);
  });
  it('should be defined', () => {
    expect(playerService).toBeDefined();
  });
});
