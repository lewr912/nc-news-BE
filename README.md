# Northcoders News API

A back-end API for a Reddit style news system. Users can browse different topics and articles, as well as posting comments on articles.

This project was built with Node.js, Express and PostgreSQL, it was done with test driven development using Jest and Supertest.

**Minimum versions required to run**

- Node.js >= 18 (Developed with v24.8.0)
- PostgreSQL >= 12 (Developed with v16.10)

Hosted version here: https://newsit-xcqx.onrender.com/api/

### Getting Started

**Clone the Repository**

- git clone https://github.com/lewr912/nc-news-BE.git

- cd nc-news-BE

**Install Dependencies**

- npm install

**Create Environment Variables**

Create two new .env files in the root level of this repo and set the environment variables with the correct database names to connect to each database.

- .env.test - Which uses the test database - PGDATABASE=database_name_here
- .env.development - Which uses the development database - PGDATABASE=database_name_here

> Note: Please refer to db/setup-dbs.sql for the correct database names.

**Create and seed the databases**

- npm run setup-dbs
- npm run seed

**To run tests**

- npm test
