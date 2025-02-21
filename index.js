import express from "express";
import axios from "axios";
// library check time endpoint call
import responseTime from "response-time";
import dotenv from "dotenv";

const app = express();
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
