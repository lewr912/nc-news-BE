const {
  checkArticleExists,
} = require("../models/articles.models");
const {
  fetchCommentsByArticleId,
  postNewComment,
  removeCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (request, response) => {
  const { article_id } = request.params;
  return fetchCommentsByArticleId(article_id).then((comments) => {
    response.status(200).send({ comments: comments });
  });
};

exports.addCommentToArticle = (request, response) => {
  const { article_id } = request.params;
  const newComment = request.body;
  return checkArticleExists(article_id).then(() => {
    return postNewComment(article_id, newComment).then((comment) => {
      response.status(201).send({ comment: comment });
    });
  });
};

exports.deleteComment = (request, response) => {
  const { comment_id } = request.params;
  return removeCommentById(comment_id).then(() => {
    response.status(204).send()
  })
  
}
