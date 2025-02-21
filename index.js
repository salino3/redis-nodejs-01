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

app.get("/characters", async (req, res) => {
  const { data } = await axios.get("https://rickandmortyapi.com/api/character");
  return res?.json(data);
});

app.get("/ping", async (req, res) => {
  res.send("Welcome!");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
