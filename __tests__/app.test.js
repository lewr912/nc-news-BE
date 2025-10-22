const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("serves an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topics = res.body.topics;
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("serves an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});
