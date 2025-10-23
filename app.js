const express = require("express");
const db = require("./db/connection");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getArticles } = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

module.exports = app;
