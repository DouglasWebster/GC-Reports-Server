import { MockType } from "./mock-type";

export const repoMockFactory : () => MockType<any> = jest.fn(
    () => ({
        create: jest.fn(),
    })
);