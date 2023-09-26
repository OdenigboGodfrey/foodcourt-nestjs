/* eslint-disable @typescript-eslint/no-unused-vars */
export class CacheServiceMock {
  async get(key: string) {
    return null;
  }

  async set(key: string, value: any, options?: { ttl: number }) {
    return;
  }

  async del(key: string) {
    return;
  }
}
