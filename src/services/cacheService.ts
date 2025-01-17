import redisClient from "@/lib/redis";
import logger from "@/utils/logger";

export interface Movie {
  id: string;
  title: string;
  genres: string[];
  cast: string[];
  released: Date | null;
  rated: string | null;
  poster: string | null;
}

export interface CacheResult<T> {
  results: T[];
  missingKeys: string[];
}

export const getDataFromCacheOrDb = async <T extends Movie>(
  keys: string
): Promise<CacheResult<T>> => {
  const results: T[] = [];
  const missingKeys: string[] = [];

  try {
    console.log(keys);
    const cachedData = await redisClient.get(keys);
    console.log(cachedData);

    if (cachedData) {
      console.log(`Data for key "${keys}" retrieved from Redis`);
      results.push(JSON.parse(cachedData) as T);
    } else {
      missingKeys.push(keys);
    }

    return { results, missingKeys };
  } catch (error) {
    console.log(error);
    logger.error("Error: ", error);
  }
};
