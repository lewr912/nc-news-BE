const express = require("express");
const db = require("./db/connection");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getArticles, getArticleById } = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.use((error, request, response, next) => {
  if(error.code === "22P02") {
    response.status(400).send({message: "You have made a bad request"})
  }
})

module.exports = app;
