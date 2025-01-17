import logger from "@/utils/logger";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

await redisClient.connect();

logger.info("Redis Client Connected Succesfully");

export default redisClient;
