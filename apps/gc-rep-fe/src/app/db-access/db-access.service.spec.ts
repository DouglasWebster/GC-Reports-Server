import { TestBed } from '@angular/core/testing';

import { DbAccessService } from './db-access.service';

describe('DbAccessService', () => {
  let service: DbAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
