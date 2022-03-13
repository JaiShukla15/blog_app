const { Sequelize,DataTypes } = require("sequelize");
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const connection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: "localhost",
  dialect: "postgres",
  pool:{max:5,min:0,idle:10000}
});

const db = {};

db.user = require("./models/user")(connection, DataTypes);
db.posts = require("./models/post")(connection, DataTypes);
db.comments = require("./models/comments")(connection, DataTypes);


db.user.hasMany(db.posts,{foreignKey:'user_id' , as:'posts'})

db.posts.belongsTo(db.user,{foreignKey:'user_id'});

db.posts.hasMany(db.comments)

db.comments.belongsTo(db.posts);
db.comments.belongsTo(db.user);
db.user.hasMany(db.comments, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

(async () => {
  try {
    await connection.authenticate();
    connection.sync({ alter: true });
  } catch (err) {
    throw err;
  }
})();
module.exports = {
  connection,
  db
};
