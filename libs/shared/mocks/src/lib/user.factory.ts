import { IUser } from '@lib/shared/models';
import { randNumber, randPassword, randUser } from '@ngneat/falso';

export const createMockUser = (): IUser => {
    const id = randNumber({ min: 1, max: 1000 });
    const { email } = randUser();
    const password = randPassword()[0];
    return {
      id,
      email,
      password,
    };
  };