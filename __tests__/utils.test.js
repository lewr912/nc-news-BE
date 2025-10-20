const {
  convertTimestampToDate,
  createLookupObj,
} = require("../db/seeds/utils");

xdescribe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createLookupObj", () => {
  test("returns an empty object when passed an empty array", () => {
    const testArr = [];
    expect(createLookupObj(testArr)).toEqual({});
  });
  test("returns an object with single key value pair when passed an array containing only one object", () => {
    const testArr = [
      {
        article_id: 4,
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 1602419040000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const key = "title";
    const value = "article_id";
    const result = { Moustache: 4 };
    expect(createLookupObj(testArr, key, value)).toEqual(result);
  });
  test("returns an object with multiple key value pairs when passed an array containing multiple objects", () => {
    const testArr = [
      {
        article_id: 1,
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 1589433300000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 2,
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 1579126860000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 3,
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 1602419040000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 4,
        title: "Another article about Mitch",
        topic: "mitch",
        author: "butter_bridge",
        body: "There will never be enough articles about Mitch!",
        created_at: 1602419040000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const key = "title";
    const value = "article_id";
    const result = {
      "Seven inspirational thought leaders from Manchester UK": 1,
      "Am I a cat?": 2,
      "Moustache": 3,
      "Another article about Mitch": 4,
    };
    expect(createLookupObj(testArr, key, value)).toEqual(result);
  });
  test("does not mutate the the original input array", () => {
    const testArr = [
      {
        article_id: 1,
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 1602419040000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    createLookupObj(testArr, "title", "article_id");
    const control = [
      {
        article_id: 1,
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 1602419040000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    expect(testArr).toEqual(control);
  });
});
