const db = require("./connection");




db.query(`SELECT * FROM users RETURNING *`)
.then((

})

db.end();