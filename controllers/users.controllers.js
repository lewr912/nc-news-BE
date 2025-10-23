const { fetchUsers } = require("../models/users.models");

exports.getUsers = (request, response) => {
  return fetchUsers().then((rows) => {
    response.status(200).send({ users: rows });
  });
};
