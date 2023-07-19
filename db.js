const { Sequelize,DataTypes } = require("sequelize");
const redis = require('redis');
const REDIS_URL = process.env.REDIS_URL;
let redisClient = redis.createClient(REDIS_URL);
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
db.likes = require("./models/likes")(connection, DataTypes);
db.chats = require("./models/chat")(connection, DataTypes);

db.user.hasMany(db.posts,{foreignKey:'user_id' , as:'posts'})
db.user.hasMany(db.chats,{foreignKey:'sender_id' , as:'chats'})
db.user.hasMany(db.chats,{foreignKey:'receiver_id'})



db.posts.belongsTo(db.user,{foreignKey:'user_id'});

db.chats.belongsTo(db.user,{foreignKey:'sender_id'});
db.chats.belongsTo(db.user,{foreignKey:'receiver_id'});


db.posts.hasMany(db.comments)
db.user.hasMany(db.likes,{foreignKey:'user_id'});
db.likes.belongsTo(db.posts,{foreignKey:'post_id'});
db.likes.belongsTo(db.user,{foreignKey:'user_id'});
db.posts.hasMany(db.likes,{foreignKey:'post_id'});

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
    redisClient = await redisClient.connect();
    await connection.authenticate();
    connection.sync({
      alter:true
    });
  } catch (err) {
    throw err;
  }
})();
module.exports = {
  connection,
  db,
  redisClient
};
