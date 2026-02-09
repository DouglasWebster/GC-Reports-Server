import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TOKEN_STORAGE_KEY } from '@lib/client/util';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ITokenResponse } from '@lib/shared/models';
import { randEmail } from '@ngneat/falso';
import { ILoginPayload } from '@lib/shared/models';
import { firstValueFrom } from 'rxjs';
const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhbGxhY2UyQHRoZWZ1bGxzdGFjay5lbmdpbmVlciIsInN1YiI6ImE5ZjdkOTExLTExNWUtNDRkYy04NjNhLWQyM2MyOGJlMDJkNSIsImlhdCI6MTY3OTkzMzkzNiwiZXhwIjoxNjc5OTM0NTM2fQ.J5NFi_zaSYTYiplDn05OXx0f6gMWWHw7Ki7Hw7kKp3U';
describe('AuthService', () => {
  let authService: AuthService;
  let httpTesting: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });
    authService = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(authService).toBeTruthy();
  });
  it('should update localStorage when setting a token', (done) => {
    authService.setToken('foo');
    authService.accessToken$.subscribe({
      next: (token) => {
        expect(token).toEqual('foo');
        expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toEqual('foo');
        done();
      },
      error: done.fail,
    });
  });
  it('should clear localStorage when clearing a token', (done) => {
    authService.clearToken();
    authService.accessToken$.subscribe({
      next: (token) => {
        expect(token).toBeNull();
        expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
        done();
      },
      error: done.fail,
    });
  });
  it('should load a token from localStorage', (done) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, EXPIRED_TOKEN);
    authService.loadToken();
    authService.accessToken$.subscribe({
      next: (token) => {
        expect(token).toStrictEqual(EXPIRED_TOKEN);
        done();
      },
      error: done.fail,
    });
  });
  it('should login a user', async () => {
    const resp: ITokenResponse = {
      access_token: '',
    };
    const user: ILoginPayload = { email: randEmail(), password: '' };
    const userData$ = authService.loginUser(user);
    const userPromise = firstValueFrom(userData$);
    const req = httpTesting.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(resp);
    expect(await userPromise).toEqual(resp);
  });
  it('should detect an expired token', (done) => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhbGxhY2VAdGhlZnVsbHN0YWNrLmVuZ2luZWVyIiwic3ViIjoiYmQ0ZTNmOTEtMDUxZC00NGU4LTgyMDQtZmY4YjFjYzk1OTU3IiwiaWF0IjoxNjgwMDE0MDQwLCJleHAiOjE2ODAwMTQ2NDB9.LdH-sN9IXD78P9z78a8k__70zS6FFqOenpiNrJ6eifg';
    authService.setToken(token);
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toStrictEqual(token);
    authService.loadToken();
    expect(authService.isTokenExpired()).toStrictEqual(true);
    done();
  });
  it('should say a token is expired when one in not loaded', (done) => {
    expect(authService.isTokenExpired()).toStrictEqual(true);
    done();
  });
  afterEach(() => {
    authService.clearToken();
    httpTesting.verify();
  });
});
