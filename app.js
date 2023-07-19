require("dotenv").config();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const {Sequelize} = require("sequelize");
const express = require("express");
const app = express();
const {connection} = require('./db');
const cors = require('cors');
const session = require("express-session");
const swaggerJSON = require('./Swagger.json');
const ErrorHandler = require("./middlewares/errorHandler");
var SequelizeStore = require("connect-session-sequelize")(session.Store);
app.use(express.json());
app.use(
  session({
    store: new SequelizeStore({
      db: connection,
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(cors());
app.use('/api/docs',swaggerUI.serve,swaggerUI.setup(swaggerJSON))
app.use("/api/users", require("./routes/user"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/posts", require("./routes/comment"));
app.use("/api/chats", require("./routes/chat"));
app.use(ErrorHandler);
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
