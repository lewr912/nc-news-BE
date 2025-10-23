const express = require("express");
const db = require("./db/connection");
const app = express();

app.use(express.json());

app.get("/api/topics", (req, res) => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
});

app.get("/api/articles", (req, res) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
    });
});

app.get("/api/users", (req, res) => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
});

module.exports = app;
