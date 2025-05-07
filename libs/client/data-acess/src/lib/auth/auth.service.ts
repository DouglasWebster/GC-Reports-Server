import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TOKEN_STORAGE_KEY } from '@lib/client/util';
import {
  IAccessTokenPayload,
  ILoginPayload,
  ITokenResponse,
} from '@lib/shared/models';
import { environment } from '@lib/shared/util-env';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, share, take, tap } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private accessToken$$ = new BehaviorSubject<string | null>(null);
  private userData$$ = new BehaviorSubject<IAccessTokenPayload | null>(null);

  /**
   * The encoded token is stored so that it can be used by an interceptor
   * and injected as a header
   */
  accessToken$ = this.accessToken$$.pipe();

  /**
   * Data from the decoded JWT including a user's ID and email address
   */
  userData$ = this.userData$$.pipe();

  setToken(val: string) {
    this.accessToken$$.next(val);
    localStorage.setItem(TOKEN_STORAGE_KEY, val);
  }

  clearToken() {
    this.accessToken$$.next(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  loadToken() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    console.log(`[AuthService] Loaded token: ${token?.slice(0, 12)}`);
    if (token) {
      this.accessToken$$.next(token);
      this.userData$$.next(this.decodeToken(token));
    }
  }

  loginUser(data: ILoginPayload): Observable<ITokenResponse> {
    console.log(`[AuthService] Logging in user`, data);
    return this.http
      .post<ITokenResponse>(`${this.baseUrl}/auth/login`, data, httpOptions)
      .pipe(
        take(1),
        tap(({ access_token }) => {
          this.setToken(access_token);
          this.userData$$.next(this.decodeToken(access_token));
        }),
        share()
      );
  }

  logoutUser() {
    console.log(`[AuthService] Logging out user`);
    this.clearToken();
    this.userData$$.next(null);
  }

  /**
   * Compares the 'exp' field of the JWT with the current time.  Returns
   * a boolean with a 5 seconds grace period.
   */
  isTokenExpired(): boolean {
    const expiryTime = this.userData$$.value?.['exp'];
    console.log(`[AuthService] Checking for token expiration...`);
    if (expiryTime) {
      const expireTs = 1000 * +expiryTime;
      const now = new Date().getTime();
      console.log(
        `[AuthService] Time left to expiration: ${Math.round(
          (expireTs - now) / 1000
        )} seconds`
      );

      return expireTs - now <= 0;
    }
    console.log(
      `[AuthService] No epiration time found! Setting expired to true`
    );
    return true;
  }

  private decodeToken(token: string | null): IAccessTokenPayload | null {
    if (token) {
      return jwtDecode(token) as IAccessTokenPayload;
    }
    return null;
  }
}
