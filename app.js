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
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`
    )
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
      console.log(rows);
    });
});

module.exports = app;
