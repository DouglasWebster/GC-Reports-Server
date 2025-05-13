export interface ICompetitor {
  position: number;
  name: string;
  division: number;
  handicap: number;
  handicapIndex? : number
  grossScore?: number;
  points?: number;
}

export interface ITwos {
  name: string;
  hole: number;
}

export interface IResult {
  name: string;
  date: Date;
  cards: number;
  players: ICompetitor[];
  twos: ITwos[];
}
export function interfaces(): string {
  return 'interfaces';
}

export interface ITees {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string
}

export type ICreateUser = Pick<IUser, 'email' | 'password' | 'name'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;

/**
 * we need something for exposed API payloads
 */
export type IPublicUserData = Omit<IUser, 'password'>;

export interface ITokenResponse {
  access_token: string;
}

export interface IAccessTokenPayload {
  email: string;

  name: string;

 /**
  * user's ID will be used as the subject
  */
  sub: string;

  [key: string]: string | number | boolean | unknown;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
