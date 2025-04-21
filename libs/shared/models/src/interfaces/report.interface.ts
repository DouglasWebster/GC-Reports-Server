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
  id: string;
  email: string;
  password: string;
}

export type ICreateUser = Pick<IUser, 'email' | 'password'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUsertUser = IUser;

/**
 * we need something for exposed API payloads
 */
export type IPublicUserData = Omit<IUser, 'password'>;
