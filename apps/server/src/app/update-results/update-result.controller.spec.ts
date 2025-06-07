import { Test, TestingModule } from '@nestjs/testing';
import { UpdateResultController } from './update-result.controller';
import { DrizzleService } from '../../db/database/drizzle.service';
import { drizzle } from 'drizzle-orm/node-postgres';
import { UpdateResultsService } from './update-results.service';
import { CompFormService } from '../comp-form/comp-form.service';
import { CompetitionService } from '../competition/competition.service';
import { PlayerService } from '../player/player.service';
import { TwoService } from '../two/two.service';
import { MemberService } from '../member/member.service';

describe('UpdateResultController', () => {
  let controller: UpdateResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateResultController],
      providers: [
        UpdateResultsService,
        CompFormService,
        CompetitionService,
        PlayerService,
        TwoService,
        MemberService,
        {
          provide: DrizzleService,
          useValue: {
            db: drizzle.mock()
          }
        }
      ]
    }).compile();

    controller = module.get<UpdateResultController>(UpdateResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
