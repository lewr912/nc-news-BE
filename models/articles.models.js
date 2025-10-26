const db = require("../db/connection");

exports.fetchArticles = ({ sort_by = "created_at", order = "DESC" }) => {
  const validSortOrder = [ "ASC", "DESC" ];
  const validSortColumns = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"];
  if (!validSortOrder.includes(order) || !validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Bad request, Invalid sort query"})
  }
  
  return db
    .query(
      `SELECT 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id)::INT AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id 
      ORDER BY ${sort_by} ${order}`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return rows;
    });
};

exports.fetchPatchedArticle = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
