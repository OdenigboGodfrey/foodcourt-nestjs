import { CacheServiceMock } from './cache.mock-class';

export const CacheModule = {
  register: jest.fn(() => ({
    useFactory: () => ({
      get: CacheServiceMock.prototype.get,
      set: CacheServiceMock.prototype.set,
      del: CacheServiceMock.prototype.del,
    }),
  })),
};
