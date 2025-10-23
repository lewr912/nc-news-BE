const { fetchArticles } = require("../models/articles.models");

exports.getArticles = (request, response) => {
  return fetchArticles().then((rows) => {
    response.status(200).send({ articles: rows });
  });
};
