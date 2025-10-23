const {
  fetchArticles,
  fetchArticleById,
} = require("../models/articles.models");

exports.getArticles = (request, response) => {
  return fetchArticles().then((rows) => {
    response.status(200).send({ articles: rows });
  });
};

exports.getArticleById = (request, response) => {
  const { article_id } = request.params;
  return fetchArticleById(article_id).then((article) => {
    response.status(200).send({ article: article });
  });
};
