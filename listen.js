const app = require("./app");

const { PORT = 9002 } = process.env

app.listen(PORT, () => console.log(`App listening on ${PORT}`));