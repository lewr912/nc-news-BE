const { fetchCommentsByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = (request, response) => {
  const { article_id } = request.params;
  return fetchCommentsByArticleId(article_id).then((comments) => {
    console.log(comments);
    response.status(200).send({ comments: comments });
  });
};
