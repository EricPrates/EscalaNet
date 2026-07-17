import { jest } from '@jest/globals';

jest.mock('../shared/utils/authStorage', () => ({
    authStorage: {
        getStore: jest.fn(),
        run: jest.fn(),
    },
    getContext: jest.fn(),
}));