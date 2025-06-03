import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.error("Redis error:", err));

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to Redis");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
};

// Modern Redis client already returns promises
const getAsync = async (key) => await client.get(key);
const setAsync = async (key, value) => await client.set(key, value);
const lPushAsync = async (list, value) => await client.lPush(list, value);
const brPopAsync = async (list, timeout) => await client.brPop(list, timeout);
const incrAsync = async (key) => await client.incr(key);

export {
  client,
  connectRedis,
  getAsync,
  setAsync,
  lPushAsync,
  brPopAsync,
  incrAsync,
};
