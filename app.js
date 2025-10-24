const express = require("express");
const db = require("./db/connection");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticleById,
  patchArticle,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  getCommentsByArticleId,
  addCommentToArticle,
} = require("./controllers/comments.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", addCommentToArticle);

app.patch("/api/articles/:article_id", patchArticle);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "You have made a bad request" });
  }
});

module.exports = app;
