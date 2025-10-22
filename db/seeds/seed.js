const db = require("../connection");
const { format } = require("node-pg-format");
const { convertTimestampToDate, createLookupObj } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
    slug VARCHAR(20) NOT NULL PRIMARY KEY,
    description VARCHAR(120),
    img_url VARCHAR(1000)
    );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
        username VARCHAR(30) NOT NULL PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR(20) NOT NULL references topics(slug),
        author VARCHAR(30) NOT NULL references users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        article_id INT references articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR(30) NOT NULL references users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const sqlTopics = format(
        `INSERT INTO topics(slug, description, img_url) VALUES %L`,
        formattedTopics
      );
      return db.query(sqlTopics);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const sqlUsers = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L`,
        formattedUsers
      );
      return db.query(sqlUsers);
    })
    .then(() => {
      const articleDatesFormatted = articleData.map((article) => {
        return convertTimestampToDate(article);
      });
      const formattedArticles = articleDatesFormatted.map((article) => {
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          article.created_at,
          article.votes,
          article.article_img_url,
        ];
      });
      const sqlArticles = format(
        `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING * `,
        formattedArticles
      );
      return db.query(sqlArticles);
    })
    .then((articleTable) => {
      const articlesLookup = createLookupObj(
        articleTable.rows,
        "title",
        "article_id"
      );
      const commentDatesFormatted = commentData.map((comment) => {
        return convertTimestampToDate(comment);
      });
      const formattedComments = commentDatesFormatted.map((comment) => {
        return [
          articlesLookup[comment.article_title],
          comment.body,
          comment.votes,
          comment.author,
          comment.created_at,
        ];
      });
      const sqlComments = format(
        `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments
      );
      return db.query(sqlComments);
    });
};

module.exports = seed;
