import express from "express";
import axios from "axios";
// library check time endpoint call
import responseTime from "response-time";
import { createClient } from "redis";
import dotenv from "dotenv";

const app = express();

// Redis data remain saved always, after server down too
const client = createClient({
  // 127.0.0.1
  host: "localhost",
  // default port Redis 6379
  port: 6379,
});

dotenv.config();

app.use(responseTime());

// Characters
app.get("/characters", async (req, res) => {
  const reply = await client.get("characters");

  if (reply) {
    return res.json(JSON.parse(reply));
  }

  const { data } = await axios.get("https://rickandmortyapi.com/api/character");

  const saveResult = await client.set("characters", JSON.stringify(data), {
    EX: 3600,
  }); // Expiry in 1 hour
  console.log("Save Result:", saveResult);
  return res?.json(data);
});

// Character (:id)
app.get("/characters/:id", async (req, res) => {
  const { id } = req.params;

  // Add name call to Redis with call parameters
  const reply = await client.get(id);

  if (reply) {
    return res.json(JSON.parse(reply));
  }

  const { data } = await axios.get(
    `https://rickandmortyapi.com/api/character/${id}`
  );

  const saveResult = await client.set(id, JSON.stringify(data), { EX: 3600 }); // Expiry in 1 hour

  console.log("Save Result ID:", saveResult);

  return res.json(data);
});

// Clean Redis memory endpoint
app.get("/clean-redis", async (req, res) => {
  try {
    await client.flushAll(); // Clean all Redis keys
    console.log("Redis memory has been cleaned.");
    res.send("Redis memory has been successfully cleaned.");
  } catch (error) {
    console.error("Error cleaning Redis:", error);
    res.status(500).send("Error cleaning Redis memory.");
  }
});

// Endpoint to delete a single Redis key
app.delete("/key/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const result = await client.del(key);
    if (result === 1) {
      res.send(`Key "${key}" was successfully deleted.`);
    } else {
      res.status(404).send(`Key "${key}" does not exist.`);
    }
  } catch (error) {
    console.error("Error deleting key:", error);
    res.status(500).send("Error deleting key.");
  }
});

// Ping
app.get("/ping", async (req, res) => {
  res.send("Welcome!");
});

async function main() {
  // Before Redis, after Express
  await client.connect();
  await app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
  });
}

main();
