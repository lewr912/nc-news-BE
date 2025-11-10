const {
  fetchArticles,
  fetchArticleById,
  fetchPatchedArticle,
  checkArticleExists,
  postNewArticle,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getArticles = (request, response) => {
  const { topic } = request.query;

  const reqPromises = [fetchArticles(request.query)]

  if(topic) {reqPromises.push(checkTopicExists(topic))}
  
      return Promise.all(reqPromises).then((results) => {
        response.status(200).send({ articles: results[0] });
      
    });

};

exports.getArticleById = (request, response) => {
  const { article_id } = request.params;
  return fetchArticleById(article_id).then((article) => {
    response.status(200).send({ article: article });
  });
};

exports.patchArticle = (request, response) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  return checkArticleExists(article_id).then(() => {
    return fetchPatchedArticle(article_id, inc_votes).then((article) => {
      response.status(200).send({ article: article });
    });
  });
};

exports.addArticle = (request, response) => {
   const newArticle = request.body;
  return checkTopicExists(newArticle.topic).then(() => {
    return postNewArticle(newArticle).then((article) => {
      response.status(201).send({ article: article });
    });
  });
};
