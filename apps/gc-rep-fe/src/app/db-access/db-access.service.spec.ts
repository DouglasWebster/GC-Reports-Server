import { TestBed } from '@angular/core/testing';

import { DbAccessService } from './db-access.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('DbAccessService', () => {
  let service: DbAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DbAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
