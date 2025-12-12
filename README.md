# Northcoders News API

Hosted version here: https://newsit-xcqx.onrender.com

> Note: Please find the list of valid endpoints below

---

### Project Summary

A RESTful API for a Reddit style news system. Users can browse different topics and articles, as well as posting comments on articles.

This project was built with Node.js, Express and PostgreSQL, it was done with test driven development using Jest and Supertest.

---

**Minimum versions required to run**

- Node.js >= 18 (Developed with v24.8.0)
- PostgreSQL >= 12 (Developed with v16.10)

Check your current versions with:
`node -v`  
`psql --version`

---

### Getting Started

**Clone the Repository**

```
git clone https://github.com/lewr912/nc-news-BE.git

cd nc-news-BE
```

---

**Install Dependencies**

Install all packages required to run this project using this command:

`npm install`

---

**Create Environment Variables**

Create two new .env files in the root level of this repo and set the environment variables with the correct database names to connect to each database.

- .env.test - Which uses the test database - `PGDATABASE=database_name_here`
- .env.development - Which uses the development database - `PGDATABASE=database_name_here`

> Note: Please refer to db/setup-dbs.sql for the correct database names.

---

**Create and seed the databases**

```
npm run setup-dbs
npm run seed
```

---

**To run tests**

To run all jest test suites enter this command:

`npm test`

---

**To Start the Server**

Enter this command to run this project locally, the server will listen on port 9002 by default.

`npm start`

---

### Valid endpoints

| Method | Endpoint                           | Description                                         |
| ------ | ---------------------------------- | --------------------------------------------------- |
| GET    | /api/users                         | Responds with a list of all users                   |
| GET    | /api/topics                        | Responds with a list of all topics                  |
| GET    | /api/articles                      | Responds with a list of all articles                |
| GET    | /api/articles/:article_id          | Responds with a single article by article_id        |
| PATCH  | /api/articles/:article_id          | Updates the vote count on an article                |
| GET    | /api/articles/:article_id/comments | Responds with a list of all comments for an article |
| POST   | /api/articles/:article_id/comments | Adds a new comment to an article                    |
| DELETE | /api/comments/:comment_id          | Deletes a comment by comment_id                     |
