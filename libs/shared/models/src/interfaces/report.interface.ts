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
