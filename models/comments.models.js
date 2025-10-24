const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return rows;
    });
};

exports.postNewComment = (article_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, body, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
  .then(({rows, rowCount}) => {
    if(rowCount === 0){
      return Promise.reject({ status: 404, message: "Not Found"})
    }
    return rows
  })
}
