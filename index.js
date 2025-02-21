import express from "express";
import axios from "axios";
// library check time endpoint call
import responseTime from "response-time";
import { createClient } from "redis";
import dotenv from "dotenv";

const app = express();

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

  const saveResult = await client.set("characters", JSON.stringify(data));
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

  const saveResult = await client.set(id, JSON.stringify(data), { EX: 3600 }); // Expira en 1 hora

  console.log("Save Result ID:", saveResult);

  return res.json(data);
});

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
