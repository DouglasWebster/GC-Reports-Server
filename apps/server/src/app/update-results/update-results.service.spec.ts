import { Test, TestingModule } from '@nestjs/testing';
import { UpdateResultsService } from './update-results.service';
import { drizzle } from 'drizzle-orm/node-postgres';
import { MemberService } from '../member/member.service';
import { CompFormService } from '../comp-form/comp-form.service';
import { CompetitionService } from '../competition/competition.service';
import { PlayerService } from '../player/player.service';
import { TwoService } from '../two/two.service';
import { DrizzleService } from '../../db/database/drizzle.service';

describe('UpdateResultsService', () => {
  let service: UpdateResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        CompFormService,
        CompetitionService,
        PlayerService,
        TwoService,
        UpdateResultsService,
        {
          provide: DrizzleService,
          useValue: drizzle.mock(),
        },
      ],
    }).compile();

    service = module.get<UpdateResultsService>(UpdateResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
