import cache from 'memory-cache';

export enum CacheTTL {
  ONE_MINUTE = 60000,
  FIVE_MINUTES = 300000,
  TEN_MINUTES = 600000,
  THIRTY_MINUTES = 1800000,
  ONE_HOUR = 3600000,
  ONE_DAY = 86400000,
  ONE_WEEK = 604800000,
}

class CacheService {
  public get<T>(key: string): T | null {
    return cache.get(key);
  }

  public set<T>(key: string, data: T, ttl: number = CacheTTL.ONE_DAY): void {
    cache.put(key, data, ttl);
  }

  public delete(key: string): void {
    cache.del(key);
  } 
  
  public async getOrSet<T>(key: string, cb: Promise<T>, ttl?: number): Promise<T> {
    cache.get(key);

    if (cache.get(key)) {
      return cache.get(key);
    }
    const data = await cb;
    cache.put(key, data, ttl);
    
    return data;
  }
}

export default new CacheService();