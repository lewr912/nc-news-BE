const {
  fetchCommentsByArticleId,
  postNewComment,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (request, response) => {
  const { article_id } = request.params;
  return fetchCommentsByArticleId(article_id).then((comments) => {
    response.status(200).send({ comments: comments });
  });
};

exports.respondNewPost = (request, response) => {
  const { article_id } = request.params;
  const newComment = request.body;
  return postNewComment(article_id, newComment).then((comment) => {
    response.status(201).send({ comment: comment });
  });
};
