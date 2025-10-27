const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");

beforeEach(() => {return seed(data)});
afterAll(() => {return db.end()});

describe("GET /, server healthcheck", () => {
  test("200: Responds with server healthy message when connection is successful", () => {
    return request(app)
    .get("/")
    .expect(200)
    .then(({ body: { message } }) => {
      expect(message).toBe("Server is healthy")
    })
  })
})

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all articles, with added comment_count for each article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: Sorting Queries Descending by default", () => {
    const sortingColumns = [
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "article_img_url",
      "comment_count",
    ];
    return Promise.all(sortingColumns.map((column) => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: column })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy(column, { descending: true });
        });
    }));
  });
  test("Sorting Queries Ascending", () => {
    const sortingColumns = [
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "article_img_url",
      "comment_count",
    ];
    return Promise.all(sortingColumns.map((column) => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: column, order: "ASC" })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy(column, { ascending: true });
        });
    }));
  });
  test("400: Responds with an error message when an invalid column is provided as sort query", () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "not_a_column" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request, Invalid sort query");
      });
  });
  test("400: Responds with an error message when an invalid order query is provided", () => {
    return request(app)
      .get("/api/articles")
      .query({ sort_by: "votes", order: "15234" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request, Invalid sort query");
      });
  });
  test("200: Query filter by topic", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "cats" })
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article.topic).toBe("cats");
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: Responds with an empty array when query topic exists in the database but has no associated articles", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "paper" })
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0)
      });
  });
  test("404: Responds with an error message when query contains a topic that does not exist in the database", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "pap" })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found")
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article with the requested article_id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", 4);
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("400: Responds with an error message when a request is made for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("You have made a bad request");
      });
  });
  test("404: Responds with an error message when a request is made for an article_id that is valid but not present in the database", () => {
    return request(app)
      .get("/api/articles/73058")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
  test("200: Requested article contains added comment_count property with a correct value of comments containing the requested article_id", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.author).toBe("rogersop")
        expect(article.title).toBe("UNCOVERED: catspiracy to bring down democracy")
        expect(article.article_id).toBe(5)
        expect(article.body).toBe("Bastet walks amongst us, and the cats are taking arms!")
        expect(article.topic).toBe("cats")
        expect(article.created_at).toBe("2020-08-03T13:14:00.000Z")
        expect(article.votes).toBe(0)
        expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        expect(article.comment_count).toBe(2)
      });
  })
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all comments for the article matching the requested article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", 1);
        });
      });
  });
  test("400: Responds with an error message when a request for an articles comments is made with an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("You have made a bad request");
      });
  });
  test("404: Responds with an error message when a request for an articles comments is made with a valid article_id that is not present in the database", () => {
    return request(app)
      .get("/api/articles/54701/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment when post request is successful on the article matching the article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Incredibly interesting new comment",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("article_id", 3);
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", "butter_bridge");
        expect(comment).toHaveProperty(
          "body",
          "Incredibly interesting new comment"
        );
        expect(comment).toHaveProperty("article_id", 3);
      });
  });
  test("400: Responds with an error message when post request for a new comment is made with an invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Incredibly interesting comment number two",
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("You have made a bad request");
      });
  });
  test("404: Responds with an error message when post request for a new comment is made with a valid article_id that is not available in the database", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Incredibly interesting comment number three",
    };
    return request(app)
      .post("/api/articles/47832/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the requested article with updated vote count", () => {
    const updateVotes = { inc_votes: 9 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("400: Responds with an error message when patch request is made with an invalid article_id", () => {
    const updateVotes = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/hello")
      .send(updateVotes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("You have made a bad request");
      });
  });
  test("400: Responds with an error message when patch request is made with invalid data type", () => {
    const updateVotes = { inc_votes: "hello" };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("You have made a bad request");
      });
  });

  test("404: Responds with an error message when patch request is made to an article that does not exist in the database", () => {
    const updateVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/34753")
      .send(updateVotes)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with status 204 and no content when comment is deleted", () => {
    return request(app).delete("/api/comments/6").expect(204);
  });
  test("400: Responds with error message when delete request is made with invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("You have made a bad request");
      });
  });
  test("404: Responds with error message when delete request is made with valid comment_id that does not exist in the database", () => {
    return request(app)
      .delete("/api/comments/25427")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
});
