import express from "express";
import axios from "axios";

const app = express();

app.get("/characters", async (req, res) => {
  const { data } = await axios.get("https://rickandmortyapi.com/api/character");
  return res?.json(data);
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
