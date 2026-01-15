const express = require("express");
const app = express();

const config = require("./config.json");

const mongoURI = config.MONGODB_URI || "mongodb://localhost:27017/newsFeed";

const mongoose = require("mongoose");
const Leaderboard = require("./model");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

app.get("/topRankings", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const coders = await Leaderboard.find()
      .sort({ global_rank: 1 }) 
      .skip(offset)
      .limit(limit);

    res.json(coders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { app, db };
