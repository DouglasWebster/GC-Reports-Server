import { IUser } from '@lib/shared/models';
import { randFullName, randNumber, randPassword, randUser } from '@ngneat/falso';

export const createMockUser = (): IUser => {
    const id = randNumber({ min: 1, max: 1000 });
    const { email } = randUser();
    const password = randPassword()[0];
    const name = randFullName({withAccents: false})
    return {
      id,
      email,
      password,
      name,
    };
  };