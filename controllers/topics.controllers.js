const { fetchTopics } = require("../models/topics.models");

exports.getTopics = (request, response) => {
  return fetchTopics().then((rows) => {
    response.status(200).send({ topics: rows });
  });
};
